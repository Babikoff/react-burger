import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { useGetAllOrdersQuery } from '@/services/ws-api';

import type { JSX } from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrders = (): JSX.Element => {
  const {
    data,
    currentData,
    error,
    isUninitialized,
    isLoading,
    isError,
    isFetching,
    isSuccess,
    status,
  } = useGetAllOrdersQuery(undefined);

  console.log(
    'isUninitialized, isLoading, isError, isFetching, isSuccess,  status',
    isUninitialized,
    isLoading,
    isError,
    isFetching,
    isSuccess,
    status
  );

  console.log('orders', data, currentData);
  if (error) console.log('error', error);

  if (isUninitialized || isLoading || isFetching)
    return (
      <main className={styles.container}>
        <Preloader />
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
    if (!data.orders || data.orders.length === 0) {
      return (
        <main className={styles.container}>
          <p className="text_type_main-default mt-2">Нет заказов</p>
        </main>
      );
    } else {
      return (
        <main className={styles.container}>
          <ul>
            {data.orders.map((order) => (
              <li key={order._id}>{order.number}</li>
            ))}
          </ul>
        </main>
      );
    }
  }

  return <></>;
};
