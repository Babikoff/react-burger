import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { useCreateOrderMutation } from '../../api/burgerApi.js';
import Modal from '../modal/modal.jsx';
import OrderDetails from './order-details/order-details.jsx';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [isOrderCardOpen, setIsOrderCardOpen] = useState(false);
  const [isErrorMessageOpen, setIsErrorMessageOpen] = useState(false);
  const [createOrderMutation] = useCreateOrderMutation();

  const totalPrice = '5678'; //TODO: вычислить

  const chosenBun = ingredients.find((item) => item.type === 'bun');
  const bunInternals = ingredients.filter((item) => item.type !== 'bun');

  async function handleOrderButtonClick() {
    const response = await createOrderMutation();

    if (response.data) {
      setOrderNumber(response.data?.order?.number);
      setIsOrderCardOpen(true);
    } else if (response.error) {
      console.log('Order creation error:', response.error); // Log the whole object
      console.log(`Error details: ${JSON.stringify(response.error)}`);
      setIsErrorMessageOpen(true);
    }
  }

  function handleCloseModal() {
    setIsOrderCardOpen(false);
  }

  function handleCloseErrorMessage() {
    setIsErrorMessageOpen(false);
  }

  return (
    <section className={styles.burger_constructor}>
      {chosenBun && (
        <header className={`${styles.bun} pl-15 pr-4`}>
          <ConstructorElement
            type="top"
            text={`${chosenBun.name} (верх)`}
            price={chosenBun.price}
            thumbnail={chosenBun.image}
            isLocked={true}
          />
        </header>
      )}
      <ul className={`${styles.ingredients_list} custom-scroll`}>
        {bunInternals.map((item) => (
          <li key={item._id} className={`${styles.ingredient_item} mb-2 pr-1`}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={item.name}
              type={item.type}
              price={item.price}
              thumbnail={item.image}
              isLocked={false}
            />
          </li>
        ))}
      </ul>
      {chosenBun && (
        <footer className={`${styles.bun} pl-15 pr-4`}>
          <ConstructorElement
            type="bottom"
            text={`${chosenBun.name} (низ)`}
            price={chosenBun.price}
            thumbnail={chosenBun.image}
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
