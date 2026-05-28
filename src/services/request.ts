import { defaultRequestOptions, host } from '@/services/apiConstants';

import { type AuthResponse, type RequestOptions, ServerError } from './api_types';

// Функция проверки ответа от сервера
export async function checkResponse(response: Response): Promise<AuthResponse> {
  const res = await response.json();

  if (response.ok) {
    return res;
  }

  throw new ServerError(res.message, response.status);
}

// Функция отправки запроса
export async function request(
  endpoint: string,
  options: RequestOptions
): Promise<AuthResponse> {
  const response: Response = await fetch(`${host}/api/${endpoint}`, {
    ...defaultRequestOptions,
    ...options,
  });

  return await checkResponse(response);
}
