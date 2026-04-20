import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { useCreateOrderMutation } from '../../api/burgerApi.js';
import {
  setBun,
  appendBunFilling,
  removeBunFilling,
  clearAll,
} from '../../services/burgerConstructorSlice.js';
import { DndItemTypes } from '../../utils/consts.js';
import Modal from '../modal/modal.jsx';
import OrderDetails from './order-details/order-details.jsx';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [isOrderCardOpen, setIsOrderCardOpen] = useState(false);
  const [isErrorMessageOpen, setIsErrorMessageOpen] = useState(false);

  const [createOrderMutation] = useCreateOrderMutation();

  // Ссылки на булку и начинку в глобальном хранилище
  const { bun: selectedBun, bunFillings: selectedBunFillings } = useSelector(
    (state) => state.burgerConstructorSlice
  );

  const totalPrice = '5678'; //TODO: вычислить

  const dispatch = useDispatch();

  const [, /*{ draggedItemType, canDrop, isOver: isDraggingItemOver }*/ dropTargetRef] =
    useDrop({
      accept: DndItemTypes.Ingredient,
      drop(item) {
        const { ingredient } = item;
        console.log('dragged', ingredient);
        if (ingredient.type === 'bun') {
          dispatch(setBun(ingredient));
        } else {
          dispatch(appendBunFilling(ingredient));
          ingredients = [...ingredients, ingredient];
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

  function isOrderButtonDisabled() {
    console.log(selectedBunFillings.length);
    return !selectedBun || !selectedBunFillings || selectedBunFillings.length <= 0;
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
    console.log('removing: ', ingredient);
    dispatch(removeBunFilling(ingredient));
  }

  function handleCloseModal() {
    dispatch(clearAll());
    setIsOrderCardOpen(false);
  }

  function handleCloseErrorMessage() {
    setIsErrorMessageOpen(false);
  }

  return (
    <section ref={dropTargetRef} className={styles.burger_constructor}>
      {selectedBun && (
        <header className={`${styles.bun} pl-15 pr-4`}>
          <ConstructorElement
            type="top"
            text={`${selectedBun.name} (верх)`}
            price={selectedBun.price}
            thumbnail={selectedBun.image}
            isLocked={true}
          />
        </header>
      )}
      <ul className={`${styles.ingredients_list} custom-scroll`}>
        {selectedBunFillings.map((ingredient) => (
          <li key={ingredient.key} className={`${styles.ingredient_item} mb-2 pr-1`}>
            <DragIcon type="primary" />
            <ConstructorElement
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
      {selectedBun && (
        <footer className={`${styles.bun} pl-15 pr-4`}>
          <ConstructorElement
            type="bottom"
            text={`${selectedBun.name} (низ)`}
            price={selectedBun.price}
            thumbnail={selectedBun.image}
            isLocked={true}
          />
        </footer>
      )}

      <section className={`${styles.order} mt-4`}>
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
