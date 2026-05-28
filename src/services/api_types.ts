// Типы REST API
export interface RequestOptions {
  method: string | undefined;
  headers?: HeadersInit | undefined;
  body?: string;
}

// Кастомный класс для обработки ошибок ответа сервера
export class ServerError extends Error {
  name: string;
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

// Responses

export interface RestApiError {
  status?: number;
  statusText?: string;
  body?: string;
}

// Response запросов без аутентификации
export interface NonAuthResponse {
  success: boolean;
  message?: string;
  error?: RestApiError;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

// Аутентификация
export interface ResponseWithTokens {
  success: boolean;
  refreshToken: string;
  accessToken: string;
}

export type AuthResponse = {
  user: User;
} & ResponseWithTokens;

export interface GetUserResponse {
  success: boolean;
  user: User;
}

export type RefreshTokenResponse = {} & ResponseWithTokens;

// Order API
export interface Ingredient {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  key?: string; // nanoid для Drag and Drop
}

// User API
export interface User {
  name: string;
  email: string;
}

export interface ResetPassword {
  password: string;
  token: string;
}

export interface ForgotPassword {
  email: string;
}

export interface OrderBurgerRequest {
  ingredients: string[];
}
