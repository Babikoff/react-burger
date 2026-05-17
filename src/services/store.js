import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';

import { authApi } from './api.js';
import { burgerApi } from './burgerApi';
import burgerConstructorSlice from './burgerConstructorSlice';
import ingredientsSlice from './ingredientsSlice';

const rootReducer = combineSlices(
  authApi,
  burgerApi,
  burgerConstructorSlice,
  ingredientsSlice
);

export const configureStore = (initialState) => {
  return createStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(authApi.middleware, burgerApi.middleware);
    },
    devTools: process.env.NODE_ENV !== 'production',
  });
};
