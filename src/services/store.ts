import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authApi, nonAuthApi } from './api.ts';
import burgerConstructorSlice from './burgerConstructorSlice.ts';
import ingredientsSlice from './ingredientsSlice.ts';
import { userSlice } from './user/userSlice.ts';
import { wsApi } from './ws-api.ts';

const rootReducer = combineSlices(
  authApi,
  nonAuthApi,
  wsApi,
  burgerConstructorSlice,
  ingredientsSlice,
  userSlice
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(nonAuthApi.middleware)
      .concat(wsApi.middleware);
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
