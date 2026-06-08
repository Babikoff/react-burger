import {
  createApi,
  type BaseQueryFn,
  type EndpointBuilder,
  type QueryDefinition,
} from '@reduxjs/toolkit/query/react';

import { wsHost } from '@/services/api-constants.ts';

import { refreshToken } from './api-common.ts';
import { TApiErrorStatus, type IWsMessage } from './api-types.ts';

const wsBaseQuery: BaseQueryFn = async () => {
  return { data: { success: false, orders: [], total: 0, totalToday: 0 } as IWsMessage };
};

type BuilderType = EndpointBuilder<BaseQueryFn, never, 'wsApi'>;

/**
 * Фабрика для создания эндпоинта, получающего заказы через WebSocket.
 * @param wsPath — путь WebSocket (например, "/orders/all" или "/orders")
 */
function createWsEndpoint(
  wsPath: string
): (
  builder: BuilderType
) => QueryDefinition<void, BaseQueryFn, never, IWsMessage, 'wsApi'> {
  // Каждый эндпоинт хранит своё собственное соединение в замыкании socket внутри createWsEndpoint
  let socket: WebSocket;

  return (builder: BuilderType) =>
    builder.query<IWsMessage, void>({
      // queryFn выполняет произвольную логику и возвращает { data } или { error }
      queryFn: () => {
        return new Promise((resolve) => {
          const accessToken = localStorage.getItem('accessToken');
          const token = accessToken?.replace('Bearer ', '');
          const placeholder: IWsMessage = {
            success: false,
            orders: [],
            total: 0,
            totalToday: 0,
          };

          try {
            socket = new WebSocket(`${wsHost}${wsPath}?token=${token}`);

            // Соединение установлено — возвращаем заглушку,
            // настоящие данные придут через onmessage в onCacheEntryAdded
            socket.onopen = (): void => {
              resolve({ data: placeholder });
            };

            // Соединение не удалось — возвращаем ошибку,
            // которая установит isError в true в компоненте
            socket.onerror = (event: Event): void => {
              console.error(`Connection error: ${event}`);

              const errorMessage =
                event instanceof ErrorEvent
                  ? event.message
                  : 'Произошла ошибка WebSocket соединения.';

              resolve({
                error: {
                  status: TApiErrorStatus.CUSTOM_ERROR,
                  error: errorMessage,
                  data: errorMessage,
                },
              });
            };
          } catch (error) {
            console.error(`Connection error: ${error}`);
            resolve({
              error: {
                status: TApiErrorStatus.CUSTOM_ERROR,
                error: String(error),
                data: 'Не удалось создать WebSocket соединение.',
              },
            });
          }
        });
      },
      async onCacheEntryAdded(
        _arg: void,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const RECONNECT_PERIOD = 3000; // Пауза 3 секунды
        let reconnectTimerId: NodeJS.Timeout | string | number | undefined = undefined;
        // Флаг, который показывает, что компонент больше не ждёт данных
        let isUnsubscribed = false;

        // Навешивает обработчики на текущий socket
        const setupSocketHandlers = (): void => {
          socket.onmessage = async (event: MessageEvent): Promise<void> => {
            const data: IWsMessage = JSON.parse(event.data);
            console.log('onmessage event.data', data);

            // Проверяем, не истёк ли токен
            if (data.message === 'Invalid or missing token') {
              try {
                // 1. Получаем новую пару токенов.
                await refreshToken();

                // 2. Закрываем текущее соединение.
                socket.close();

                // 3. Открываем новое с актуальным токеном.
                await connect();
              } catch (error) {
                console.error('Не удалось обновить токен:', error);
              }

              return;
            }

            updateCachedData((draft: IWsMessage) => {
              Object.assign(draft, data);
            });
          };

          // Логика переподключения при закрытии
          socket.onclose = (): void => {
            console.log('Connection closed. Checking if it needs to be restored...');

            // Если isUnsubscribed === false, то компонент всё ещё ждёт данные
            if (!isUnsubscribed) {
              // Запускаем таймер и через 3 секунды пробуем снова
              reconnectTimerId = setTimeout(connect, RECONNECT_PERIOD);
            }
          };

          socket.onerror = (error: Event): void => {
            console.error('Ошибка WebSocket:', error);
          };
        };

        // 1. Создаём функцию для установки соединения (используется переподключением).
        const connect = async (): Promise<void> => {
          // Очищаем предыдущий таймер перед попыткой подключения
          if (reconnectTimerId) {
            clearTimeout(reconnectTimerId);
            reconnectTimerId = undefined;
          }

          // Получаем актуальный токен при каждом подключении
          const accessToken = localStorage.getItem('accessToken');
          const token = accessToken?.replace('Bearer ', '');
          socket = new WebSocket(`${wsHost}${wsPath}?token=${token}`);

          // Навешиваем обработчики на новый сокет
          setupSocketHandlers();
        };

        try {
          // 2. Ждём загрузки начальных данных (из queryFn выше).
          await cacheDataLoaded;

          // 3. Навешиваем обработчики на сокет, уже открытый queryFn.
          setupSocketHandlers();
        } catch (error: unknown) {
          // Если cacheDataLoaded реджектится —
          // значит, компонент отписался до загрузки данных
          console.log('Error in cacheDataLoaded: ' + error);
        }

        // 4. Ждём удаления записи из кеша.
        await cacheEntryRemoved;

        // Всё, теперь это сокет соединение больше не нужно ни одному компоненту.
        // 1. Устанавливаем флаг: теперь мы не должны переподключаться.
        isUnsubscribed = true;

        // 2. Гарантированная очистка ресурсов:
        clearTimeout(reconnectTimerId); // Отменяем ожидающее переподключение

        // 3. Закрываем соединение.
        socket.close();
      },
    });
}

// Создание главного API
export const wsApi = createApi({
  reducerPath: 'wsApi',

  baseQuery: wsBaseQuery,

  endpoints: (builder) => ({
    // 1. Endpoint получения всех заказов (в Ленте)
    getAllOrders: createWsEndpoint('/orders/all')(builder),

    // 2. Endpoint получения заказов пользователя (История Заказов в Профиле)
    getUserOrders: createWsEndpoint('/orders')(builder),
  }),
});

export const { useGetAllOrdersQuery, useGetUserOrdersQuery } = wsApi;
