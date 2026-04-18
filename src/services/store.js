import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';

import { burgerApi } from '../api/burgerApi';
import selectedIngredientSlice from './selectedIngredientSlice';

const rootReducer = combineSlices(burgerApi, selectedIngredientSlice);

export const configureStore = (initialState) => {
  return createStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(burgerApi.middleware);
    },
  });
};
