import { defaultRequestOptions, host } from '@/services/api-constants';

import {
  type AuthResponse,
  type NonAuthResponse,
  type IRequestOptions,
  RestApiError,
} from './api-types';

// Функция проверки ответа от сервера
export async function checkResponse(response: Response): Promise<AuthResponse> {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new RestApiError(
      response.status,
      `Request failed with status ${response.status}`,
      errorBody
    );
  }

  const res = await response.json();
  return res;
}

/**
 * Функция отправки запроса для REST методов, работающих только при авторизации
 * */
export async function requestWithAuth(
  endpoint: string,
  options: IRequestOptions
): Promise<AuthResponse> {
  const response: Response = await fetch(`${host}/api/${endpoint}`, {
    ...defaultRequestOptions,
    ...options,
  });

  return await checkResponse(response);
}

/**
 * Функция отправки запроса для REST методов, не требующих авторизации
 * */
export async function requestWithNoAuth(
  endpoint: string,
  options: IRequestOptions
): Promise<NonAuthResponse> {
  const response: Response = await fetch(`${host}/api/${endpoint}`, {
    ...defaultRequestOptions,
    ...options,
  });

  return await checkResponse(response);
}
