import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseApiUrl = 'https://new-stellarburgers.education-services.ru/api';

const API_HEADERS = {
  'Content-Type': 'application/json',
};

export const burgerApi = createApi({
  reducerPath: 'burgerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiUrl,
    //TODO: аутентификация через prepareHeaders
    prepareHeaders: (headers) => {
      for (let [key, value] of Object.entries(API_HEADERS)) {
        headers.set(key, value);
      }
    },
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: () => ({
        url: '/ingredients',
      }),
    }),
    createOrder: builder.mutation({
      query: () => ({
        url: '/orders',
        method: 'POST',
        body: JSON.stringify({
          ingredients: [
            '692889f16bf770001bfeb4cc',
            '692889f16bf770001bfeb4d6',
            '692889f16bf770001bfeb4cc',
          ],
        }),
      }),
    }),
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation } = burgerApi;
