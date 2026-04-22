import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import withDragShift from '../../hocs/with-drag-shift.jsx';
import { useCreateOrderMutation } from '../../services/burgerApi.js';
import {
  setBun,
  appendBunFilling,
  removeBunFilling,
  clearAll,
  moveBunFilling,
  selectTotalPrice,
} from '../../services/burgerConstructorSlice.js';
import { DndItemTypes } from '../../utils/consts.js';
import Modal from '../modal/modal.jsx';
import DragHowerIndicator from './drag-hower-indicator/drag-hower-indicator.jsx';
import OrderDetails from './order-details/order-details.jsx';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [isOrderCardOpen, setIsOrderCardOpen] = useState(false);
  const [isErrorMessageOpen, setIsErrorMessageOpen] = useState(false);

  const [createOrderMutation] = useCreateOrderMutation();

  // Ссылки на булку и начинку из глобального хранилища
  const selectedBun = useSelector((state) => state.burgerConstructorSlice.bun);
  const selectedBunFillings = useSelector(
    (state) => state.burgerConstructorSlice.bunFillings
  );

  // Мемоизированный селектор для TotalPrice
  const totalPrice = useSelector(selectTotalPrice);

  const dispatch = useDispatch();

  const [{ isDraggingNewIngredient, draggingIngredientType }, dropTargetRef] = useDrop({
    accept: DndItemTypes.Ingredient,
    drop(item) {
      const { ingredient } = item;
      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredient));
      } else {
        dispatch(appendBunFilling(ingredient));
      }
    },
    collect: (monitor) => ({
      isDraggingNewIngredient: monitor.isOver() && monitor.canDrop(),
      draggingIngredientType: monitor.getItem()?.ingredient?.type,
    }),
  });

  function isOrderButtonDisabled() {
    return !selectedBun || !selectedBunFillings || selectedBunFillings.length <= 0;
  }

  function hasFillings() {
    return selectedBunFillings && selectedBunFillings.length > 0;
  }

  async function handleOrderButtonClick() {
    if (isOrderButtonDisabled()) {
      console.log('No data for order');
      return;
    }

    const response = await createOrderMutation([
      selectedBun._id,
      ...selectedBunFillings.map((filling) => filling._id),
      selectedBun._id,
    ]);

    if (response.data) {
      setOrderNumber(response.data?.order?.number);
      setIsOrderCardOpen(true);
    } else if (response.error) {
      console.log('Order creation error:', response.error); // Log the whole object
      console.log(`Error details: ${JSON.stringify(response.error)}`);
      setIsErrorMessageOpen(true);
    }
  }

  function removeIngredient(ingredient) {
    dispatch(removeBunFilling(ingredient));
  }

  function handleCloseModal() {
    dispatch(clearAll());
    setIsOrderCardOpen(false);
  }

  function handleCloseErrorMessage() {
    setIsErrorMessageOpen(false);
  }

  // Мемоизируем callback для перестановки ингредиентов
  const handleItemMove = useCallback(
    (fromIndex, toIndex) => {
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
    <section ref={dropTargetRef} className={styles.burger_constructor}>
      <header className={`${styles.bun_block} pl-4 pr-2`}>
        {selectedBun ? (
          <ConstructorElement
            className={styles.bun}
            type="top"
            text={`${selectedBun?.name} (верх)`}
            price={selectedBun?.price}
            thumbnail={selectedBun?.image}
            isLocked={true}
          />
        ) : (
          <DragHowerIndicator
            className={`${styles.emptyItem} ${styles.empty_bun} ${styles.empty_top_bun}`}
            dragItemTypeId={DndItemTypes.Ingredient}
            isHover={isDraggingNewIngredient && draggingIngredientType === 'bun'}
          >
            <div className="text text_type_main-small">Выберите булки</div>
          </DragHowerIndicator>
        )}
      </header>
      <ul className={`${styles.ingredients_list} pl-1 pr-8 custom-scroll`}>
        {
          // Вставляем заглушку "пустой ингредиент" во внутрь списка, чтобы не повторять его отступы
          !hasFillings() && (
            <li className={`${styles.ingredient_item} mt-2 mb-2 ml-7 mr-0`}>
              <DragHowerIndicator
                className={`${styles.emptyItem} text text_type_main-small`}
                dragItemTypeId={DndItemTypes.Ingredient}
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
          >
            <DragIcon type="primary" />
            <WithDragShiftConstructorElement
              itemIndex={index}
              text={ingredient.name}
              type={ingredient.type}
              price={ingredient.price}
              thumbnail={ingredient.image}
              isLocked={false}
              isDraggable={true}
              handleClose={() => removeIngredient(ingredient)}
            />
          </li>
        ))}
      </ul>
      <footer className={`${styles.bun_block} pl-4 pr-2`}>
        {selectedBun ? (
          <ConstructorElement
            className={styles.bun}
            type="bottom"
            text={`${selectedBun?.name} (низ)`}
            price={selectedBun?.price}
            thumbnail={selectedBun?.image}
            isLocked={true}
          />
        ) : (
          <DragHowerIndicator
            className={`${styles.emptyItem} ${styles.empty_bun} ${styles.empty_bottom_bun}`}
            dragItemTypeId={DndItemTypes.Ingredient}
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
        <Modal closeModal={handleCloseModal}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
      {isErrorMessageOpen && (
        <Modal closeModal={handleCloseErrorMessage}>
          <h2 className={`${styles.error_message} text text_type_main-large`}>
            Произошла ошибка отправки данных.
          </h2>
        </Modal>
      )}
    </section>
  );
};
