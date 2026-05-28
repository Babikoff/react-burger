import { createAsyncThunk } from '@reduxjs/toolkit';

import { authApi } from '@services/api';
import { isTokenExists } from '@services/tokens';

import { setIsAuthChecked } from './userSlice';

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    try {
      if (isTokenExists()) {
        console.log('Token exists. Called checkUserAuth');
        const response = await dispatch(
          authApi.endpoints.getUser.initiate(undefined, { forceRefetch: true })
        );
        console.log(
          response.data
            ? `Loaded user: ${response.data?.name}/${response.data?.email}.`
            : `Could not load user info/ Error: ${response.error}`
        );
      } else {
        console.log('No token.');
      }
    } finally {
      dispatch(setIsAuthChecked(true));
    }
  }
);
