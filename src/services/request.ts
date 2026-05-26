import { defaultRequestOptions, host } from '@/services/apiConstants';

import type { RequestOptions, TokenResponse } from './api_types';

// Кастомный класс для обработки ошибок ответа сервера
class ServerError extends Error {
  name: string;
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

// Функция проверки ответа от сервера
export async function checkResponse(response: Response): Promise<TokenResponse> {
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
): Promise<TokenResponse> {
  const response: Response = await fetch(`${host}/api/${endpoint}`, {
    ...defaultRequestOptions,
    ...options,
  });

  return await checkResponse(response);
}
