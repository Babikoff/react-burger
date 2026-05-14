import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';

import { burgerApi } from './burgerApi';
import burgerConstructorSlice from './burgerConstructorSlice';
import ingredientsSlice from './ingredientsSlice';

const rootReducer = combineSlices(burgerApi, burgerConstructorSlice, ingredientsSlice);

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
