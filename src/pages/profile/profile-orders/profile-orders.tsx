import type { JSX } from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrders = (): JSX.Element => {
  return (
    <main className={styles.container}>
      <p className="text_type_main-default mt-2">История заказов пока не реализованна</p>
    </main>
  );
};
