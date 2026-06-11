import {
  createApi,
  type BaseQueryFn,
  type EndpointBuilder,
  type QueryDefinition,
} from '@reduxjs/toolkit/query/react';

import { wsHost } from '@/services/api-constants.ts';

import { refreshToken } from './api-common.ts';
import { TApiErrorStatus, type IOrdersMessage } from './api-types.ts';
import { WebSocketClient } from './ws-client.ts';

const wsBaseQuery: BaseQueryFn = async () => {
  return {
    data: { success: false, orders: [], total: 0, totalToday: 0 } as IOrdersMessage,
  };
};

type BuilderType = EndpointBuilder<BaseQueryFn, never, 'wsApi'>;

/**
 * Фабрика для создания эндпоинта, получающего заказы через WebSocket.
 * @param subPath — путь внутри хоста WebSocket к нужному сервису
 * (например, "/orders/all" или "/orders").
 * @needAccessToken - нужно ли соединению работать с access/refresh токенами
 * (добавлять к URL, обновлять и т.п.)
 */
function createWsEndpoint(
  subPath: string,
  needAccessToken: boolean
): (
  builder: BuilderType
) => QueryDefinition<void, BaseQueryFn, never, IOrdersMessage, 'wsApi'> {
  // Каждый эндпоинт хранит своё собственное соединение в замыкании
  let wsClient: WebSocketClient | null = null;

  // Ошибка, которую может вернуть queryFn
  interface IQueryFnError {
    status: string;
    error: string;
    data: string;
  }

  // Тип возвращаемого значения queryFn (либо данные, либо ошибка)
  type TQueryFnResult = { data: IOrdersMessage } | { error: IQueryFnError };

  return (builder: BuilderType) =>
    builder.query<IOrdersMessage, void>({
      // queryFn создаёт WebSocketClient и резолвится только при первом реальном сообщении
      // (иначе мы получим, что по всем статусам данные загруженны, но список - пуст
      // и не возможно определить придут ли в него данные позже или их нет совсем).
      queryFn: (): Promise<TQueryFnResult> => {
        return new Promise((resolve) => {
          wsClient = new WebSocketClient({
            url: `${wsHost}${subPath}`,
            tokenGetter: (): string | null =>
              needAccessToken ? localStorage.getItem('accessToken') : null,
            tokenRefresher: refreshToken,
          });

          // Обработчики событий
          // Прим. все обработчики событий в queryFn должны вызывать resolve,
          // чтобы компонент получил обновления статусов.

          wsClient.onMessage = (data: unknown): void => {
            const msg = data as IOrdersMessage;
            console.log('onMessage1:', data, new Date());

            if (msg.success !== undefined) {
              resolve({ data: msg });
            }
          };

          // Если соединение сразу прервалось — сообщаем об ошибке
          wsClient.onError = (_event: Event, message?: string): void => {
            resolve({
              error: {
                status: TApiErrorStatus.CUSTOM_ERROR,
                error: message ?? 'Ошибка WebSocket соединения.',
                data: message ?? 'Произошла ошибка WebSocket соединения.',
              },
            });
          };

          if (needAccessToken) {
            wsClient.onCheckIfTokenExpiredMessage = (message: unknown): boolean => {
              return message === 'Invalid or missing token';
            };
          }

          // Стартуем настроенный клиент
          wsClient.connect();
        });
      },

      // Регулярная логика (после начальной инициализации) получения данных
      async onCacheEntryAdded(
        _arg: void,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          // 1. Ждём загрузки начальных данных (из queryFn выше).
          //    К этому моменту wsClient уже проинициализирован в queryFn.
          await cacheDataLoaded;
        } catch (error: unknown) {
          // Если cacheDataLoaded реджектится —
          // значит, компонент отписался до загрузки данных
          console.log('Error in cacheDataLoaded: ' + error, new Date());
          return;
        }

        if (!wsClient) {
          console.error('queryFn: WebSocketClient was not created.');
          return;
        }

        // 2. Переопределяем onMessage: теперь каждое новое сообщение обновляет кеш.
        wsClient.onMessage = (data: unknown): void => {
          updateCachedData((draft: IOrdersMessage) => {
            console.log('onMessage2:', data, new Date());
            Object.assign(draft, data as IOrdersMessage);
          });
        };

        // 3. Ждём удаления записи из кеша.
        await cacheEntryRemoved;

        // 4. Всё, теперь это сокет-соединение больше не нужно ни одному компоненту.
        wsClient.dispose();
      },
    });
}

/**
 * Создание главного WebSoket API, содержащего дочерние эндпойнты.
 */
export const wsApi = createApi({
  reducerPath: 'wsApi',

  baseQuery: wsBaseQuery,

  endpoints: (builder) => ({
    // 1. Endpoint получения всех заказов (в Ленте)
    getAllOrders: createWsEndpoint('/orders/all', false)(builder),

    // 2. Endpoint получения заказов пользователя (История Заказов в Профиле)
    getUserOrders: createWsEndpoint('/orders', true)(builder),
  }),
});

export const { useGetAllOrdersQuery, useGetUserOrdersQuery } = wsApi;
