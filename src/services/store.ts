import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authApi } from './api.js';
import burgerConstructorSlice from './burgerConstructorSlice.js';
import ingredientsSlice from './ingredientsSlice.js';
import { userSlice } from './user/userSlice.js';

const rootReducer = combineSlices(
  authApi,
  burgerConstructorSlice,
  ingredientsSlice,
  userSlice
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(authApi.middleware);
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
