import { OrdersList } from '@/components/order/orders-list/orders-list';
import { useGetUserOrdersQuery } from '@/services/ws-api';

import type { JSX } from 'react';

import type { IOrdersData } from '@/services/api-types';

export const ProfileOrders = (): JSX.Element => {
  const orders: IOrdersData = useGetUserOrdersQuery(undefined);
  return <OrdersList ordersData={orders} />;
};
