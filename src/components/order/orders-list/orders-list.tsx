import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import OrderCard from '@/components/order/order-card/order-card';

import type { JSX } from 'react';

import type { IOrdersData } from '@/services/api-types';
import type { IOrderListOptions } from '@/services/ui-types';

import styles from './orders-list.module.css';

interface IOrdersListProps {
  ordersData: IOrdersData;
  orderListOptions: IOrderListOptions;
}

export const OrdersList = (props: IOrdersListProps): JSX.Element => {
  const { data, error, isUninitialized, isLoading, isError, isSuccess } =
    props.ordersData;

  if (error) console.log('error', error);

  if (isUninitialized || isLoading)
    return (
      <main className={styles.preloader_container}>
        <div className={styles.preloader}>
          <Preloader />
        </div>
      </main>
    );

  if (isError)
    return (
      <main className={styles.container}>
        <h2 className={`${styles.error_message} text text_type_main-default`}>
          Произошла ошибка загрузки данных.
        </h2>
      </main>
    );

  if (isSuccess) {
    if (data?.orders) {
      if (data.orders.length > 0) {
        return (
          <main className={styles.container}>
            <ul className={`${styles.orders_list} custom-scroll`}>
              {data.orders.map((order) => (
                <li key={order._id}>
                  <OrderCard
                    order={order}
                    orderCardOptions={props.orderListOptions.orderCardOptions}
                  />
                </li>
              ))}
            </ul>
          </main>
        );
      } else {
        return (
          <main className={styles.container}>
            <p className="text_type_main-default mt-2">Нет заказов</p>
          </main>
        );
      }
    }
  }

  return <></>;
};
