import { createApi } from '@reduxjs/toolkit/query/react';

import { ServerError } from './api_types';
import { request } from './request.js';

import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import type {
  ResponseWithTokens,
  RefreshTokenResponse,
  RequestOptions,
} from './api_types';

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const response = await request('auth/token', {
    method: 'GET',
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  });
  console.log('refreshToken: token refreshed');
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response;
}

export async function fetchWithRefresh(
  endpoint: string,
  options: RequestOptions
): Promise<ResponseWithTokens> {
  try {
    return await request(endpoint, options);
  } catch (error: unknown) {
    if (
      error instanceof ServerError &&
      (error.statusCode === 401 || error.statusCode === 403) &&
      localStorage.getItem('refreshToken')
    ) {
      console.log('We need to refresh token');
      const refreshData = await refreshToken();
      console.log('Token refreshed. New access token: ', refreshData.accessToken);

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

// BaseQueryFn — это тип из RTK Query, описывающий функцию базового запроса.
// Он принимает три дженерика:
//   1) Тип аргументов запроса (BaseQueryArgs) — содержит url, method, body.
//   2) Тип успешного ответа (ResponseWithTokens) — что возвращается при успехе.
//   3) Тип ошибки (unknown) — произвольная структура ошибки.
// Функция должна вернуть объект с полем `data` (успех) или `error` (ошибка).
const baseQueryWithRefresh: BaseQueryFn<
  IBaseQueryArgs,
  ResponseWithTokens,
  unknown
> = async (args) => {
  const { url, method = 'GET', body } = args;
  const token = localStorage.getItem('accessToken');

  console.log('sending accessToken', token);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.authorization = token;
  }

  const options: RequestOptions = {
    method,
    headers,
    body,
  };

  const data = await fetchWithRefresh(url, options);
  return { data };
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    // Методы аутентификациии и обмена данными пользователя
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
      transformResponse: (response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.user;
      },
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
      transformResponse: (response) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        return response.user;
      },
    }),
    getUser: builder.query({
      query: () => ({
        url: 'auth/user',
        method: 'GET',
      }),
      transformResponse: (response) => response.user,
    }),
    setUser: builder.mutation({
      query: (user) => ({
        url: 'auth/user',
        method: 'PATCH',
        body: JSON.stringify(user),
      }),
      transformResponse: (response) => response.user,
    }),
    logout: builder.mutation({
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
    passwordReset: builder.mutation({
      query: (email) => ({
        url: 'password-reset',
        method: 'POST',
        body: JSON.stringify(email),
      }),
      transformResponse: (response) => {
        console.log(
          `password-reset success: ${response.success} message: ${response.message}`
        );
        return response.message;
      },
    }),
    setNewPassword: builder.mutation({
      query: (newPasswordCredentials) => ({
        url: 'password-reset/reset',
        method: 'POST',
        body: JSON.stringify(newPasswordCredentials),
      }),
      transformResponse: (response) => {
        console.log(
          `password-reset success: ${response.success} message: ${response.message}`
        );
        return response.message;
      },
    }),
    // Получение ингредиентов
    //getIngredients: builder.query<{ success: boolean; data: Ingredient[] }, void>({
    getIngredients: builder.query({
      query: () => ({
        url: 'ingredients',
      }),
    }),
    // Создание заказа
    createOrder: builder.mutation({
      query: (orderIngredientsIds) => ({
        url: 'orders',
        method: 'POST',
        body: JSON.stringify({
          ingredients: orderIngredientsIds,
        }),
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetIngredientsQuery,
  useSetUserMutation,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  usePasswordResetMutation,
  useSetNewPasswordMutation,
  useCreateOrderMutation,
} = authApi;
