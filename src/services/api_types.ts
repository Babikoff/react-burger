// Типы REST API
export type RequestOptions = {
  method?: string;
  headers: HeadersInit | undefined;
  body?: string;
};

// Аутентификация
export type TokenResponse = {
  success: boolean;
  refreshToken: string;
  accessToken: string;
};

export type AuthResponse = {
  user: User;
} & TokenResponse;

export type GetUserResponse = {
  success: boolean;
  user: User;
};

export type RefreshTokenResponse = {} & TokenResponse;

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
