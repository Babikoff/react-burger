import { request } from './request.ts';

import type { RefreshTokenResponse } from './api-types.ts';

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const response = await request('auth/token', {
    method: 'POST',
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  });
  console.log('refreshToken: token refreshed', new Date());
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response;
}
