// Типы REST API
export type RequestOptions = {
  method: string | undefined;
  headers?: HeadersInit | undefined;
  body?: string;
};

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

// Аутентификация
export type ResponseWithTokens = {
  success: boolean;
  refreshToken: string;
  accessToken: string;
};

export type AuthResponse = {
  user: User;
} & ResponseWithTokens;

export type GetUserResponse = {
  success: boolean;
  user: User;
};

export type RefreshTokenResponse = {} & ResponseWithTokens;

// Order API
export type Ingredient = {
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
  //key?: string; // nanoid для Drag and Drop
};

// User API
export type User = {
  name: string;
  email: string;
};

export type ResetPassword = {
  password: string;
  token: string;
};

export type ForgotPassword = {
  email: string;
};

export type OrderBurgerRequest = {
  ingredients: string[];
};
