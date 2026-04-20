import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import { DndItemTypes } from '../../../utils/consts';

import styles from './ingredient.module.css';

function Ingredient({ ingredient, onSelect }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: DndItemTypes.Ingredient,
    item: { ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  function handleListItemClick() {
    onSelect(ingredient);
  }

  function handleListItemKeyDown(event) {
    if (event.key === 'Enter') onSelect(ingredient);
  }

  return (
    <li
      ref={dragRef}
      className={`${isDragging && styles.ingredient_dragging} ${styles.ingredient}`}
      onClick={handleListItemClick}
      onKeyDown={handleListItemKeyDown}
    >
      <Counter count={1} />
      <div>
        <img src={ingredient.image} alt={ingredient.name} />
        <div className={styles.ingredient_price}>
          <span className="text text_type_digits-default">{ingredient.price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <div>
          <span className="text text_type_main-default">{ingredient.name}</span>
        </div>
      </div>
    </li>
  );
}

export default Ingredient;
