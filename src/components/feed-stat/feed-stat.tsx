import type { JSX } from 'react';

import type { IOrdersMessage } from '@/services/api-types';

import styles from './feed-stat.module.css';

interface IFeedStatProps {
  feedStat?: IOrdersMessage;
}

function FeedStat({ feedStat }: IFeedStatProps): JSX.Element {
  const doneOrders = feedStat?.orders
    .filter((order) => order.status === 'done')
    .slice(0, 10);

  const pendingOrders = feedStat?.orders
    .filter((order) => order.status === 'pending')
    .slice(0, 10);

  return (
    <main className={`${styles.feed_stat} pl-15`}>
      <section className={`${styles.orders_main_section} mb-15`}>
        <section className={`${styles.orders_section} mr-9`}>
          <header className="text text_type_main-medium mb-6">Готовы:</header>
          <section
            className={`${styles.order_section} ${styles.ready_order_section} text text_type_digits-default`}
          >
            {doneOrders?.map((order, index) => (
              <div key={index}>{order.number}</div>
            ))}
          </section>
        </section>
        <section className={styles.orders_section}>
          <header className="text text_type_main-medium mb-6">В работе:</header>
          <section className={`${styles.order_section} text text_type_digits-default`}>
            {pendingOrders?.map((order, index) => (
              <div key={index}>{order.number}</div>
            ))}
          </section>
        </section>
      </section>
      <section className={`${styles.totals_section} mb-15`}>
        <header className="text text_type_main-medium">Выполнено за всё время:</header>
        <section className="text text_type_digits-large">{feedStat?.total}</section>
      </section>
      <section className={styles.totals_section}>
        <header className="text text_type_main-medium">Выполнено за сегодня:</header>
        <section className="text text_type_digits-large">{feedStat?.totalToday}</section>
      </section>
    </main>
  );
}

export default FeedStat;
