import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useState, type JSX } from 'react';
import { useDrop } from 'react-dnd';
import { useNavigate } from 'react-router-dom';

import NewOrderDetails from '@/components/order/new-order-details-card/new-order-details';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { useCreateOrderMutation } from '@services/api';
import {
  addIngrediednt,
  removeBunFilling,
  clearAll,
  moveBunFilling,
  selectTotalPrice,
} from '@services/burgerConstructorSlice';
import { selectUser } from '@services/user/userSlice';

import withDragShift from '../../hocs/with-drag-shift';
import { DndItemTypes } from '../../utils/app-constants';
import Modal from '../modal/modal';
import DragHowerIndicator from './drag-hower-indicator/drag-hower-indicator';

import type { IIngredient } from '@/services/api-types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): JSX.Element => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [isOrderCardOpen, setIsOrderCardOpen] = useState(false);
  const [isErrorMessageOpen, setIsErrorMessageOpen] = useState(false);

  const [createOrderMutation] = useCreateOrderMutation();

  // Ссылки на булку и начинку из глобального хранилища
  const selectedBun = useAppSelector((state) => state.burgerConstructorSlice.bun);
  const selectedBunFillings = useAppSelector(
    (state) => state.burgerConstructorSlice.bunFillings
  );

  // Мемоизированный селектор для TotalPrice
  const totalPrice = useAppSelector(selectTotalPrice);

  const dispatch = useAppDispatch();

  const [{ isDraggingNewIngredient, draggingIngredientType }, dropTargetRef] = useDrop<
    {
      ingredient: IIngredient;
    },
    unknown,
    {
      isDraggingNewIngredient: boolean;
      draggingIngredientType: string | undefined;
    }
  >({
    accept: DndItemTypes.Ingredient,
    drop(item) {
      const { ingredient } = item;
      dispatch(addIngrediednt(ingredient));
    },
    collect: (monitor) => ({
      isDraggingNewIngredient: monitor.isOver() && monitor.canDrop(),
      draggingIngredientType: monitor.getItem()?.ingredient?.type,
    }),
  });

  function isOrderButtonDisabled(): boolean {
    return !selectedBun || !selectedBunFillings || selectedBunFillings.length <= 0;
  }

  function hasFillings(): boolean {
    return selectedBunFillings && selectedBunFillings.length > 0;
  }

  async function handleOrderButtonClick(): Promise<void> {
    if (isOrderButtonDisabled()) {
      console.log('No data for order');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedBun || !selectedBunFillings || selectedBunFillings.length === 0) {
      console.log('Burger is not completed');
      return;
    }

    const response = await createOrderMutation([
      selectedBun!._id,
      ...selectedBunFillings.map((filling) => filling._id),
      selectedBun!._id,
    ]);

    if (response.data) {
      setOrderNumber(response.data);
      setIsOrderCardOpen(true);
    } else if (response.error) {
      console.log('Order creation error:', response.error); // Log the whole object
      console.log(`Error details: ${JSON.stringify(response.error)}`);
      setIsErrorMessageOpen(true);
    }
  }

  function removeIngredient(ingredient: IIngredient): void {
    dispatch(removeBunFilling(ingredient));
  }

  function handleCloseModal(): void {
    dispatch(clearAll());
    setIsOrderCardOpen(false);
  }

  function handleCloseErrorMessage(): void {
    setIsErrorMessageOpen(false);
  }

  // Мемоизируем callback для перестановки ингредиентов
  const handleItemMove = useCallback(
    (fromIndex: number, toIndex: number) => {
      dispatch(moveBunFilling({ fromIndex, toIndex }));
    },
    [dispatch]
  );

  // Мемоизируем HOC
  const WithDragShiftConstructorElement = useMemo(
    () =>
      withDragShift(ConstructorElement, DndItemTypes.ConstructorItem, handleItemMove),
    []
  );

  return (
    <section
      ref={(htmlElement) => {
        dropTargetRef(htmlElement);
      }}
      className={styles.burger_constructor}
    >
      <header
        className={`${styles.bun_block} pl-4 pr-2`}
        data-testid="burger-constructor"
      >
        {selectedBun ? (
          <ConstructorElement
            extraClass={styles.bun}
            type="top"
            text={`${selectedBun?.name} (верх)`}
            price={selectedBun?.price}
            thumbnail={selectedBun?.image}
            isLocked={true}
          />
        ) : (
          <DragHowerIndicator
            className={`${styles.emptyItem} ${styles.empty_bun} ${styles.empty_top_bun}`}
            isHover={isDraggingNewIngredient && draggingIngredientType === 'bun'}
          >
            <div className="text text_type_main-small">Выберите булки</div>
          </DragHowerIndicator>
        )}
      </header>
      <ul
        className={`${styles.ingredients_list} pl-1 pr-8 custom-scroll`}
        data-testid="constructor-ingredients-list"
      >
        {
          // Вставляем заглушку "пустой ингредиент" во внутрь списка, чтобы не повторять его отступы
          !hasFillings() && (
            <li className={`${styles.ingredient_item} mt-2 mb-2 ml-7 mr-0`}>
              <DragHowerIndicator
                className={`${styles.emptyItem} text text_type_main-small`}
                isHover={isDraggingNewIngredient && draggingIngredientType !== 'bun'}
              >
                Выберите начинку
              </DragHowerIndicator>
            </li>
          )
        }
        {selectedBunFillings.map((ingredient, index) => (
          <li
            key={ingredient.key}
            className={`${styles.ingredient_item} mt-2 mb-2 pr-1`}
            data-testid={`constructor-item-${index + 1}`}
          >
            <DragIcon type="primary" />
            <div className={styles.constructor_item}>
              <WithDragShiftConstructorElement
                itemIndex={index}
                itemId={DndItemTypes.ConstructorItem}
                text={ingredient.name}
                price={ingredient.price}
                thumbnail={ingredient.image}
                isLocked={false}
                handleClose={() => removeIngredient(ingredient)}
              />
            </div>
          </li>
        ))}
      </ul>
      <footer className={`${styles.bun_block} pl-4 pr-2`}>
        {selectedBun ? (
          <ConstructorElement
            extraClass={styles.bun}
            type="bottom"
            text={`${selectedBun?.name} (низ)`}
            price={selectedBun?.price}
            thumbnail={selectedBun?.image}
            isLocked={true}
          />
        ) : (
          <DragHowerIndicator
            className={`${styles.emptyItem} ${styles.empty_bun} ${styles.empty_bottom_bun}`}
            isHover={isDraggingNewIngredient && draggingIngredientType === 'bun'}
          >
            <div className="text text_type_main-small">Выберите булки</div>
          </DragHowerIndicator>
        )}
      </footer>
      <section className={`${styles.order} mt-8 mr-10`}>
        <div className={styles.order_price}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          type="primary"
          size="large"
          htmlType="button"
          disabled={isOrderButtonDisabled()}
          onClick={handleOrderButtonClick}
        >
          Оформить заказ
        </Button>
      </section>
      {isOrderCardOpen && (
        <Modal header="" closeModal={handleCloseModal}>
          <NewOrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
      {isErrorMessageOpen && (
        <Modal header="" closeModal={handleCloseErrorMessage}>
          <h2 className={`${styles.error_message} text text_type_main-large`}>
            Произошла ошибка отправки данных.
          </h2>
        </Modal>
      )}
    </section>
  );
};
