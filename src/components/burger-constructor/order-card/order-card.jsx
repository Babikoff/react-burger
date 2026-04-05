import done from '../../../images/done.svg';

import styles from './order-card.module.css';

function OrderCard({ orderNumber }) {
  return (
    <section className={styles.order_details_card}>
      <h1 className={`${styles.order_number} text text_type_digits-large`}>
        {orderNumber}
      </h1>
      <h2 className="text text_type_main-medium">идентификатор заказа</h2>
      <img src={done} />
      <section className={styles.message_block}>
        <p className="text  text_type_main-default">Ваш заказ начали готовить</p>
        <p className="text text_type_main-default text_color_inactive">
          Дождитесь готовности на орбитальной станции
        </p>
      </section>
    </section>
  );
}

export default OrderCard;
