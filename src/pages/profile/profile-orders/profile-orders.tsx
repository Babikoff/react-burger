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
  console.log('error', error);

  return (
    <main className={styles.container}>
      <p className="text_type_main-default mt-2">История заказов пока не реализованна</p>
    </main>
  );
};
