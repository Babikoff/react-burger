import { defaultRequestOptions, host } from '@/services/api-constants';

import { type AuthResponse, type IRequestOptions, RestApiError } from './api-types';

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

// Функция отправки запроса
export async function request(
  endpoint: string,
  options: IRequestOptions
): Promise<AuthResponse> {
  const response: Response = await fetch(`${host}/api/${endpoint}`, {
    ...defaultRequestOptions,
    ...options,
  });

  return await checkResponse(response);
}
