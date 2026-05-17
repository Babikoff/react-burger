import { defaultRequestOptions, host } from '@services/constants.js';

// Кастомный класс для обработки ошибок ответа сервера
class ServerError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

// Функция проверки ответа от сервера
export async function checkResponse(response) {
  const res = await response.json();

  if (response.ok) {
    return res;
  }

  throw new ServerError(res.message, res.status);
}

// Функция отправки запроса
export async function request(endpoint, options) {
  const response = await fetch(`${host}/api/${endpoint}`, {
    ...defaultRequestOptions,
    ...options,
  });

  return await checkResponse(response);
}
