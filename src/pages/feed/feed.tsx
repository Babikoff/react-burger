import FeedStat from '@/components/feed-stat/feed-stat';
import { useGetAllOrdersQuery } from '@/services/ws-api';
import { OrdersList } from '@components/order/orders-list/orders-list';

import type { JSX } from 'react';

import type { IOrdersData } from '@/services/api-types';

import styles from './feed.module.css';

export const FeedPage = (): JSX.Element => {
  const allOrders: IOrdersData = useGetAllOrdersQuery(undefined);

  return (
    <div className={styles.home}>
      <div>
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Лента заказов
        </h1>
        <main className={`${styles.main} pl-5 pr-5`}>
          <OrdersList
            ordersData={allOrders}
            orderListOptions={{
              orderCardOptions: { showOrderStatus: false, linkToUrl: '/feed' },
            }}
          />
          <FeedStat feedStat={allOrders.data} />
        </main>
      </div>
    </div>
  );
};
