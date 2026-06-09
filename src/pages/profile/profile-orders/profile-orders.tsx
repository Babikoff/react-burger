import { useMemo } from 'react';

import { OrdersList } from '@/components/order/orders-list/orders-list';
import { useGetUserOrdersQuery } from '@/services/ws-api';

import type { JSX } from 'react';

import type { IOrdersData } from '@/services/api-types';

export const ProfileOrders = (): JSX.Element => {
  const orders: IOrdersData = useGetUserOrdersQuery(undefined);

  const sortedOrdersData = useMemo<IOrdersData>(() => {
    if (!orders.data?.orders) return orders;

    return {
      ...orders,
      data: {
        ...orders.data,
        orders: [...orders.data.orders].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      },
    };
  }, [orders]);

  return (
    <OrdersList
      ordersData={sortedOrdersData}
      orderListOptions={{ orderCardOptions: { showOrderStatus: true } }}
    />
  );
};
