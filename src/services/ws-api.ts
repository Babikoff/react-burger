import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react';

import { wsHost } from '@/services/api-constants.ts';

import { refreshToken } from './api-common.ts';

import type { IWsMessage } from './api-types.ts';

const wsBaseQuery: BaseQueryFn = async () => {
  return { data: { success: false, orders: [], total: 0, totalToday: 0 } as IWsMessage };
};

// Переменная хранит активное соединение
// и доступна всем эндпоинтам в этом файле
let socket: WebSocket;

export const wsApi = createApi({
  reducerPath: 'wsApi',

  baseQuery: wsBaseQuery,

  endpoints: (builder) => ({
    // 1. Эндпойнт приёма сообщений
    getAllOrders: builder.query({
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
            socket = new WebSocket(`${wsHost}/orders/all?token=${token}`);

            // Соединение установлено — возвращаем заглушку,
            // настоящие данные придут через onmessage в onCacheEntryAdded
            socket.onopen = (): void => {
              resolve({ data: placeholder });
            };

            // Соединение не удалось — возвращаем ошибку,
            // которая установит isError в true в компоненте
            socket.onerror = (event: Event): void => {
              const errorMessage =
                event instanceof ErrorEvent
                  ? event.message
                  : 'Произошла ошибка WebSocket соединения.';
              resolve({
                error: {
                  status: 'CUSTOM_ERROR',
                  error: errorMessage,
                  data: errorMessage,
                },
              });
            };
          } catch (e) {
            resolve({
              error: {
                status: 'CUSTOM_ERROR',
                error: String(e),
                data: 'Не удалось создать WebSocket соединение.',
              },
            });
          }
        });
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const RECONNECT_PERIOD = 3000; // Пауза 3 секунды
        let reconnectTimerId: NodeJS.Timeout | string | number | undefined = undefined;
        // Флаг, который показывает, что компонент больше не ждёт данных
        let isUnsubscribed = false;

        // Навешивает обработчики на текущий socket
        const setupSocketHandlers = (): void => {
          socket.onmessage = async (event): Promise<void> => {
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

            updateCachedData((draft) => {
              Object.assign(draft, data);
            });
          };

          // Логика переподключения при закрытии
          socket.onclose = (): void => {
            console.log(
              'Соединение разорвано. Проверка необходимости переподключения...'
            );
            // Если isUnsubscribed === false, то компонент всё ещё ждёт данные
            if (!isUnsubscribed) {
              // Запускаем таймер и через 3 секунды пробуем снова
              reconnectTimerId = setTimeout(connect, RECONNECT_PERIOD);
            }
          };

          socket.onerror = (error): void => {
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
          socket = new WebSocket(`${wsHost}/orders/all?token=${token}`);

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
    }),

    // 2. Эндпоинт для отправки сообщений.
    sendMessage: builder.mutation({
      // queryFn позволяет обойти стандартный HTTP-запрос и выполнить произвольный код
      queryFn: (messageContent) => {
        // Проверяем, что сокет существует и открыт
        if (socket && socket.readyState === WebSocket.OPEN) {
          const message = { text: messageContent, id: Date.now() };

          // Отправляем данные в сокет
          socket.send(JSON.stringify(message));

          // Возвращаем результат, как будто сервер ответил успешно
          return { data: message };
        }

        return { error: { status: 500, data: 'WebSocket is not connected' } };
      },
    }),
  }),
});

export const { useGetAllOrdersQuery, useSendMessageMutation } = wsApi;
