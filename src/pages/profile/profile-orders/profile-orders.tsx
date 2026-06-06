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
  } = useGetAllOrdersQuery(undefined);

  console.log(
    'isUninitialized, isLoading, isError, isFetching, isSuccess',
    isUninitialized,
    isLoading,
    isError,
    isFetching,
    isSuccess
  );

  console.log('orders', data, currentData);

  if (error) console.log('error', error);

  if (isError)
    return (
      <main className={styles.container}>
        <h2 className={`${styles.error_message} text text_type_main-default`}>
          Произошла ошибка загрузки данных.
        </h2>
      </main>
    );

  return (
    <main className={styles.container}>
      <p className="text_type_main-default mt-2">История заказов пока не реализованна</p>
    </main>
  );
};
