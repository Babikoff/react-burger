import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';

import { burgerApi } from './burgerApi';

const rootReducer = combineSlices(burgerApi);

export const configureStore = (initialState) => {
  return createStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(burgerApi.middleware);
    },
  });
};
