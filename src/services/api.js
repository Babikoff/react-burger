import { createApi } from '@reduxjs/toolkit/query/react';

import { request } from './request.js';

export async function refreshToken() {
  const response = await request('auth/token', {
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  });
  console.log('refreshToken: token refreshed');
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response;
}

export async function fetchWithRefresh(endpoint, options) {
  try {
    return await request(endpoint, options);
  } catch (error) {
    if (
      error.statusCode === 401 ||
      (error.statusCode === 403 && localStorage.getItem('refreshToken'))
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

async function baseQueryWithRefresh(args) {
  const { url, method = 'GET', ...rest } = args;
  const token = localStorage.getItem('accessToken');

  console.log('sending accessToken', token);

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.authorization = token;
  }

  const options = {
    method,
    headers,
    ...rest,
  };

  const data = await fetchWithRefresh(url, options);
  return { data };
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
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
