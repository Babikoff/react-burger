import { createSlice } from '@reduxjs/toolkit';

import { authApi } from '@services/api';

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    setIsAuthChecked: (state, action) => {
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
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addMatcher(authApi.endpoints.getUser.matchFulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser, setIsAuthChecked } = userSlice.actions;
export const { selectIsAuthChecked, selectIsLoading, selectError, selectUser } =
  userSlice.selectors;
