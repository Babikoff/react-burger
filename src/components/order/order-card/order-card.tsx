import OrderIngredients from '@/components/order/order-ingredients/order-ingredients';

import type { JSX } from 'react';

import type { IOrderDetails } from '@/services/api-types';

import styles from './order-card.module.css';

interface IOrderCardProps {
  order: IOrderDetails;
}

function OrderCard({ order }: IOrderCardProps): JSX.Element {
  return (
    <section className={`${styles.order_card} mb-4 pl-6 pr-6 mr-2`}>
      <div className={styles.order_card_header}>
        <span className="text text_type_digits-default mt-6">#{order.number}</span>
        <span className="text text_type_main-default text_color_inactive">Сегодня</span>
      </div>
      <div className="text text_type_main-medium mt-6">{order.name}</div>
      <div className="text text_type_main-default mt-2">Создан</div>
      <div className="mt-6 mb-6">
        <OrderIngredients />
      </div>
    </section>
  );
}

export default OrderCard;
