import { createSlice } from '@reduxjs/toolkit';

import { authApi, nonAuthApi } from '@services/api';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { User } from '@services/api_types';

interface IUserSliceState {
  user?: User;
  isLoading: boolean;
  error?: string;
  isAuthChecked: boolean;
}

const initialState: IUserSliceState = {
  user: undefined,
  isLoading: false,
  error: undefined,
  isAuthChecked: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
  },
  selectors: {
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectUser: (state) => state.user,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        nonAuthApi.endpoints.login.matchFulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addMatcher(
        nonAuthApi.endpoints.register.matchFulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addMatcher(
        authApi.endpoints.getUser.matchFulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = undefined;
      });
  },
});

export const { setUser, setIsAuthChecked } = userSlice.actions;
export const { selectIsAuthChecked, selectIsLoading, selectError, selectUser } =
  userSlice.selectors;
