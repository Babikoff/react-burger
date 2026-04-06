import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import Modal from '../modal/modal.jsx';
import OrderDetails from './order-details/order-details.jsx';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  const [isOrderCardOpen, setIsOrderCardOpen] = useState(false);
  const orderNumber = '034537'; //TODO: как-то получать с backend
  const totalPrice = '5678'; //TODO: вычислить

  const chosenBun = ingredients.find((item) => item.type === 'bun');
  const bunInternals = ingredients.filter((item) => item.type !== 'bun');

  function handleOrderButtonClick() {
    console.log('Order');
    setIsOrderCardOpen(true);
  }

  function handleCloseModal() {
    setIsOrderCardOpen(false);
  }

  return (
    <section className={styles.burger_constructor}>
      {chosenBun && (
        <header className={styles.bun}>
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
          <li key={item._id} className={styles.ingredient_item}>
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
        <footer className={styles.bun}>
          <ConstructorElement
            type="bottom"
            text={`${chosenBun.name} (низ)`}
            price={chosenBun.price}
            thumbnail={chosenBun.image}
            isLocked={true}
          />
        </footer>
      )}

      <section className={styles.order}>
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
    </section>
  );
};
