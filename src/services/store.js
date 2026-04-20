import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';

import { burgerApi } from '../api/burgerApi';
import burgerConstructorSlice from './burgerConstructorSlice';
import selectedIngredientSlice from './selectedIngredientSlice';

const rootReducer = combineSlices(
  burgerApi,
  burgerConstructorSlice,
  selectedIngredientSlice
);

export const configureStore = (initialState) => {
  return createStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(burgerApi.middleware);
    },
    devTools: process.env.NODE_ENV !== 'production',
  });
};
