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
export interface ISerializableRestApiError {
  status?: number;
  statusText?: string;
  body?: string;
  message?: string;
}

export class RestApiError extends Error implements ISerializableRestApiError {
  status?: number;
  statusText?: string;
  body?: string;
  constructor(status: number, statusText?: string, body?: string) {
    super(statusText);
    this.name = 'RestApiError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

// Response запросов без аутентификации
export interface NonAuthResponse {
  success: boolean;
  message?: string;
  error?: ISerializableRestApiError;
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

// Типы WebSocket API (для работы с Orders)

export interface IWsApiError {
  status?: number;
  statusText?: string;
  body?: string;
  message?: string;
}

export type TOrderStatus = 'created' | 'pending' | 'cancelled' | 'done';

export interface IOrderDetails {
  _id: string;
  ingredients: string[];
  status: TOrderStatus;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
}

export interface IWsMessage {
  success: boolean;
  orders: IOrderDetails[];
  total: number;
  totalToday: number;
  message?: string; // Для ошибок типа: 'Invalid or missing token'
}
