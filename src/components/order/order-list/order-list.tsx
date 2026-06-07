import OrderCard from '../order-card/order-card';

import type { JSX } from 'react';

import type { IOrderDetails } from '@/services/api-types';

import styles from './order-list.module.css';

//import styles from './order-card.module.css';

interface IOrderListProps {
  orders: IOrderDetails[];
}

function OrderList({ orders }: IOrderListProps): JSX.Element {
  return (
    <ul className={`${styles.orders_list} custom-scroll`}>
      {orders.map((order) => (
        <li key={order._id}>
          <OrderCard order={order} />
        </li>
      ))}
    </ul>
  );
}

export default OrderList;
