import { createApi } from '@reduxjs/toolkit/query/react';

import { refreshToken } from './api-common.ts';
import { RestApiError } from './api-types.ts';
import { request } from './request.ts';

import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import type {
  AuthResponse,
  NonAuthResponse,
  Ingredient,
  IOrderDetails,
  ISerializableRestApiError,
  ResponseWithTokens,
  RequestOptions,
  User,
} from './api-types.ts';

export async function fetchWithRefresh(
  endpoint: string,
  options: RequestOptions
): Promise<AuthResponse> {
  try {
    return await request(endpoint, options);
  } catch (error: unknown) {
    if (
      error instanceof RestApiError &&
      (error.status === 401 || error.status === 403) &&
      localStorage.getItem('refreshToken')
    ) {
      console.log('We need to refresh token');
      const refreshData = await refreshToken();
      console.log('Token refreshed.', new Date());

      return await request(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          authorization: refreshData.accessToken,
        },
      });
    } else {
      throw error;
    }
  }
}

interface IBaseQueryArgs {
  url: string;
  method?: string;
  body?: string;
}

// Базовый запрос с автообновлением токенов.
// BaseQueryFn — это тип из RTK Query, описывающий функцию базового запроса.
// Он принимает три дженерик аргумента:
//   1) Тип аргументов запроса (BaseQueryArgs) — содержит url, method, body.
//   2) Тип успешного ответа (NonAuthResponse) — что возвращается при успехе.
//   3) Тип ошибки (ISerializableRestApiError).
// Функция должна вернуть объект с полем `data` (успех) или `error` (ошибка).
const baseNonAuthQuery: BaseQueryFn<
  IBaseQueryArgs,
  NonAuthResponse,
  ISerializableRestApiError
> = async (args) => {
  const { url, method = 'GET', body } = args;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const options: RequestOptions = {
    method,
    headers,
    body,
  };

  try {
    const data = await request(url, options);
    return { data };
  } catch (err) {
    console.error(`Error in baseNonAuthQuery: ${err}`);
    if (err instanceof RestApiError) {
      return {
        error: {
          status: err.status,
          statusText: err.statusText,
          body: err.body,
          message: err.message,
        },
      };
    }
    return { error: { message: String(err) } };
  }
};

// Базовый запрос без автообновления токенов.
// BaseQueryFn — это тип из RTK Query, описывающий функцию базового запроса.
// Он принимает три дженерик аргумента:
//   1) Тип аргументов запроса (BaseQueryArgs) — содержит url, method, body.
//   2) Тип успешного ответа (AuthResponse) — что возвращается при успехе.
//   3) Тип ошибки (ISerializableRestApiError).
// Функция должна вернуть объект с полем `data` (успех) или `error` (ошибка).
const baseQueryWithTokenRefresh: BaseQueryFn<
  IBaseQueryArgs,
  AuthResponse,
  ISerializableRestApiError
> = async (args) => {
  const { url, method = 'GET', body } = args;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('accessToken');
  if (token) {
    console.log('sending accessToken');
    headers.authorization = token;
  } else {
    console.log('no accessToken', token);
  }

  const options: RequestOptions = {
    method,
    headers,
    body,
  };

  try {
    const data = await fetchWithRefresh(url, options);
    return { data };
  } catch (err) {
    if (err instanceof RestApiError) {
      return {
        error: {
          status: err.status,
          statusText: err.statusText,
          body: err.body,
          message: err.message,
        },
      };
    }
    return { error: { message: String(err) } };
  }
};

// API для запросов, которые делаются без accessToken и refreshToken
export const nonAuthApi = createApi({
  reducerPath: 'nonAuthApi',
  baseQuery: baseNonAuthQuery,
  endpoints: (builder) => ({
    // Методы аутентификации и работы с кредами
    login: builder.mutation<User, { email: string; password: string }>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
      transformResponse: (response) => {
        if (response.success && response.accessToken && response.refreshToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          console.log('Logged in. Tokens were updated.');
        }
        if (!response.user) {
          throw new Error(
            `User data not found in response: ${JSON.stringify(response)}`
          );
        }
        return response.user;
      },
    }),

    register: builder.mutation<User, { name: string; email: string; password: string }>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
      transformResponse: (response) => {
        if (response.success && response.accessToken && response.refreshToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          console.log('Registered. Tokens were updated.');
        }
        if (!response.user) {
          throw new Error(
            `User data not found in response: ${JSON.stringify(response)}`
          );
        }
        return response.user;
      },
    }),

    passwordReset: builder.mutation<string, { email: string }>({
      query: (email) => ({
        url: 'password-reset',
        method: 'POST',
        body: JSON.stringify(email),
      }),
      transformResponse: (response) => {
        console.log(
          `password-reset success: ${response.success} message: ${response.message}`
        );
        return response.message ?? '';
      },
    }),

    setNewPassword: builder.mutation<string, { token: string; password: string }>({
      query: (newPasswordCredentials) => ({
        url: 'password-reset/reset',
        method: 'POST',
        body: JSON.stringify(newPasswordCredentials),
      }),
      transformResponse: (response) => {
        console.log(
          `password-reset success: ${response.success} message: ${response.message ?? ''}`
        );
        return response.message ?? '';
      },
    }),

    // Получение информации о заказе по id
    getOrder: builder.query<IOrderDetails, string>({
      query: (id: string) => ({
        url: `orders/${id}`,
        method: 'GET',
      }),
      transformResponse(response) {
        const result = response as unknown as { order: IOrderDetails };
        return result.order;
      },
    }),
  }),
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithTokenRefresh,
  endpoints: (builder) => ({
    // Методы обмена данными пользователя
    getUser: builder.query<User, void>({
      query: () => ({
        url: 'auth/user',
        method: 'GET',
      }),
      transformResponse: (response) => response.user,
    }),

    setUser: builder.mutation<User, { name: string; email: string; password: string }>({
      query: (user) => ({
        url: 'auth/user',
        method: 'PATCH',
        body: JSON.stringify(user),
      }),
      transformResponse: (response) => response.user,
    }),

    // Завершение аутентификации (требует текущих токенов)
    logout: builder.mutation<null, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
        body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
      }),
      transformResponse: () => {
        console.log('Removing tokens');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return null;
      },
    }),

    // Получение ингредиентов
    getIngredients: builder.query<{ data: Ingredient[] }, void>({
      query: () => ({
        url: 'ingredients',
      }),
    }),

    // Создание заказа
    createOrder: builder.mutation<string, string[]>({
      query: (orderIngredientsIds) => ({
        url: 'orders',
        method: 'POST',
        body: JSON.stringify({
          ingredients: orderIngredientsIds,
        }),
      }),
      transformResponse(response: ResponseWithTokens) {
        const result = response as unknown as { order: { number: number } };
        return result.order.number.toString();
      },
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetIngredientsQuery,
  useSetUserMutation,
  useLogoutMutation,
  useCreateOrderMutation,
} = authApi;

export const {
  useLoginMutation,
  useRegisterMutation,
  usePasswordResetMutation,
  useSetNewPasswordMutation,
  useGetOrderQuery,
} = nonAuthApi;
