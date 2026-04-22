import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseApiUrl = 'https://new-stellarburgers.education-services.ru/api';

const API_HEADERS = {
  'Content-Type': 'application/json',
};

export const burgerApi = createApi({
  reducerPath: 'burgerApi',

  // Получение списка ингредиентов
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiUrl,
    //TODO: аутентификация через prepareHeaders
    prepareHeaders: (headers) => {
      for (let [key, value] of Object.entries(API_HEADERS)) {
        headers.set(key, value);
      }
    },
  }),

  // Создание заказа
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: () => ({
        url: '/ingredients',
      }),
    }),
    createOrder: builder.mutation({
      query: (orderIngredientsIds) => ({
        url: '/orders',
        method: 'POST',
        body: JSON.stringify({
          ingredients: orderIngredientsIds,
        }),
      }),
    }),
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation } = burgerApi;
