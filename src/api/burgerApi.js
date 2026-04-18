import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseApiUrl = 'https://new-stellarburgers.education-services.ru/api';

export const burgerApi = createApi({
  reducerPath: 'burgerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiUrl,
    //TODO: аутентификация через prepareHeaders
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: () => ({
        url: '/ingredients',
      }),
    }),
  }),
});

export const { useGetIngredientsQuery } = burgerApi;
