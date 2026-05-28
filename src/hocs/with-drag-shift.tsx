import { useRef, type JSX } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface IComponentWithSwingProps {
  itemId: string;
  itemIndex: number;
}

interface IDragItem {
  itemId: string;
  itemIndex: number;
}

function withDragShift<TProps extends Record<string, unknown>>(
  Component: React.ComponentType<TProps>,
  dragItemTypeId: string,
  handleItemMove: (draggingItemIndex: number, nextIndex: number) => void
) {
  return function ComponentWithSwing(
    props: IComponentWithSwingProps & TProps
  ): JSX.Element {
    const { itemId, itemIndex, ...internalItemProps } = props;

    const ref = useRef<HTMLDivElement>(null);

    const internalProps = internalItemProps as unknown as TProps;

    const [, dragRef] = useDrag({
      type: dragItemTypeId,
      item: { itemId, itemIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, dropRef] = useDrop<IDragItem, void, unknown>({
      accept: dragItemTypeId,
      hover: (item, monitor) => {
        if (!ref.current) {
          console.log('Dragging item with no ref was ignored.');
          return;
        }

        const draggingItemIndex = item.itemIndex;
        const thisItemIndex = itemIndex;
        if (draggingItemIndex === thisItemIndex) {
          // Игнорируем drop на собственную позицию
          return;
        }

        // Получим координаты данного элемента
        const thisItemRect = ref.current.getBoundingClientRect();

        // и координаты перетаскиваемого
        const draggingItemRect = monitor.getSourceClientOffset()!;

        // Определим направление движения и пересечение середины текущего элемента.
        // При пересечении середины будем считать что требуется перемещение.
        let nextIndex = undefined;
        // Если тащим вниз
        if (draggingItemIndex < thisItemIndex) {
          // Перетащили через середину текущего - заменяем текущий
          if (draggingItemRect.y > thisItemRect.y) {
            nextIndex = thisItemIndex;
          } else {
            // Не дотащили через середину - заменяем предыдущий
            nextIndex = thisItemIndex - 1;
          }
        }

        // Если тащим вверх
        if (draggingItemIndex > thisItemIndex) {
          // Перетащили через середину текущего - заменяем текущий
          if (draggingItemRect.y < thisItemRect.y) {
            nextIndex = thisItemIndex;
          } else {
            // Не дотащили через середину - заменяем следующий
            nextIndex = thisItemIndex + 1;
          }
        }

        if (nextIndex !== undefined && nextIndex !== draggingItemIndex) {
          handleItemMove(draggingItemIndex, nextIndex);
          item.itemIndex = nextIndex;
        }
      },
    });

    dragRef(dropRef(ref));

    return (
      <div ref={ref}>
        <Component {...internalProps} />
      </div>
    );
  };
}

export default withDragShift;
