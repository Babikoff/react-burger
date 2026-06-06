import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react';

import { wsHost } from '@/services/api-constants.ts';

import { refreshToken } from './api-common.ts';

import type { IWsMessage } from './api-types.ts';

//type wsEventListener = (this: WebSocket, ev: MessageEvent<string>) => void;

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
      // HTTP-запрос начальных данных
      query: () => 'orders/all',
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const RECONNECT_PERIOD = 3000; // Пауза 3 секунды
        let reconnectTimerId: NodeJS.Timeout | string | number | undefined = undefined;
        //let ws: WebSocket = null;
        // Флаг, который показывает, что компонент больше не ждёт данных
        let isUnsubscribed = false;

        // 1. Создаём функцию для установки соединения.
        const connect = async (): Promise<void> => {
          // Очищаем предыдущий таймер перед попыткой подключения
          if (reconnectTimerId) {
            clearTimeout(reconnectTimerId);
            reconnectTimerId = undefined;
          }

          // Устанавливаем новое соединение
          //ws = new WebSocket(wsHost);
          // ... (Здесь будут слушатели onmessage и onclose)

          // 1. Создаём соединение.
          // Получаем актуальный токен при каждом подключении
          const accessToken = localStorage.getItem('accessToken');
          const token = accessToken?.replace('Bearer ', '');
          socket = new WebSocket(wsHost + '/orders/all' + `?token=${token}`);

          try {
            // 2. Ждём загрузки начальных данных.
            console.log('before cacheDataLoaded');
            await cacheDataLoaded;
            console.log('after cacheDataLoaded');

            // 3. Слушаем входящие сообщения.
            // const listener: wsEventListener = (event): void => {
            //   const message = JSON.parse(event.data);

            //   // Добавляем новое сообщение в кеш
            //   updateCachedData((draft) => {
            //     draft.push(message);
            //   });
            // };
            // socket.addEventListener('message', listener);

            // 1. Слушатель входящих сообщений (обновление кеша).
            socket.onmessage = async (event): Promise<void> => {
              console.log('onmessage event', event);

              const data: IWsMessage = JSON.parse(event.data);
              console.log('onmessage event.data', data);

              // Проверяем, не истёк ли токен
              if (data.message === 'Invalid or missing token') {
                try {
                  // 1. Получаем новую пару токенов.
                  await refreshToken();

                  // 3. Закрываем текущее соединение.
                  socket.close();

                  // 4. Открываем новое с актуальным токеном.
                  await connect();
                } catch (error) {
                  console.error('Не удалось обновить токен:', error);
                }

                return;
              }

              updateCachedData((draft) => {
                console.log('updateCachedData draft:', draft);
                Object.assign(draft, data);
              });
            };

            // 2. Логика переподключения при закрытии.
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
          } catch (error: unknown) {
            // Если cacheDataLoaded реджектится —
            // значит, компонент отписался до загрузки данных
            console.log('Error in cacheDataLoaded: ' + error);
          }
        };

        // Запускаем первое подключение
        await connect();

        // 4. Ждём удаления записи из кеша.
        await cacheEntryRemoved;

        // Всё, теперь это сокет соеднинение больше не нужно ни одному компоненту.
        // 1. Устанавливаем флаг: теперь мы не должны переподключаться.
        isUnsubscribed = true;

        // 2. Гарантированная очистка ресурсов:
        clearTimeout(reconnectTimerId); // Отменяем ожидающее переподключение

        // 5. Закрываем соединение.
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
