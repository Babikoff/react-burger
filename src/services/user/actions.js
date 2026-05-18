import { createAsyncThunk } from '@reduxjs/toolkit';

import { authApi } from '@services/api.js';
import { isTokenExists } from '@services/tokens.js';

import { setIsAuthChecked } from './userSlice.js';

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    try {
      if (isTokenExists()) {
        console.log('Token exists. Called checkUserAuth');
        const response = await dispatch(
          authApi.endpoints.getUser.initiate(undefined, { forceFetch: true })
        );
        console.log(`Loaded user ${response.user}`);
      } else {
        console.log('No token.');
      }
    } finally {
      dispatch(setIsAuthChecked(true));
    }
  }
);
