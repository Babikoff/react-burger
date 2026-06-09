import OrderFullInfo from '@/components/order/order-full-info/order-full-info';

import type { JSX } from 'react';

import styles from './order-full-info-page.module.css';

export const OrderFullInfoPage = (): JSX.Element => {
  return (
    <main className={styles.main}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Информация о заказе
      </h1>
      <OrderFullInfo />
    </main>
  );
};
