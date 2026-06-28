import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { testOrder, testUser1 } from '@/utils/tests/test-data.ts';

import { nonAuthApi } from './api.ts';
import * as requestModule from './request.ts';

import type { AppDispatch } from './store.ts';

// "индивидуальный" тестовый store для nonAuthApi.
// (на основе только nonAuthApi).
function setupStore(): ReturnType<typeof configureStore> {
  return configureStore({
    // Вместо rootReducer установим в store только редьюсер из nonAuthApi
    reducer: { [nonAuthApi.reducerPath]: nonAuthApi.reducer },
    // Эмитируем реальный Middleware, но только на основе nonAuthApi
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(nonAuthApi.middleware),
  });
}

/**
 * Тесты для проверки nonAuthApi на основе мокирования функции отправки запросов
 * через vi.spyOn(requestModule, 'requestWithNoAuth').
 */
describe('Тесты nonAuthApi (вызовы без токенов)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('getOrder', () => {
    it('Получение заказа по идентификатору', async () => {
      const spy = vi.spyOn(requestModule, 'requestWithNoAuth').mockResolvedValue({
        success: true,
        order: testOrder,
      });

      const store = setupStore();
      const dispatch = store.dispatch as AppDispatch;

      const result = await dispatch(nonAuthApi.endpoints.getOrder.initiate('3333'));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result.data).toMatchObject(testOrder);
    });
  });

  describe('Проверки /auth/login', () => {
    it('Успешный вызов /auth/login', async () => {
      // Arrange: подменяем requestWithNoAuth() успешным ответом
      const spy = vi.spyOn(requestModule, 'requestWithNoAuth').mockResolvedValue({
        success: true,
        accessToken: 'MyTestAccessToken',
        refreshToken: 'MyTestRefreshToken',
        user: testUser1,
      });

      const store = setupStore();
      const dispatch = store.dispatch as AppDispatch;

      // Act: вызываем мутацию логина
      const result = await dispatch(
        nonAuthApi.endpoints.login.initiate({
          email: testUser1.email,
          password: 'secret123',
        })
      );

      // Assert 1: проверяем вызов request() с правильными аргументами
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'tester1@testers.ru',
          password: 'secret123',
        }),
      });

      // Assert 2: проверяем, что токены сохранились в localStorage
      expect(localStorage.getItem('accessToken')).toBe('MyTestAccessToken');
      expect(localStorage.getItem('refreshToken')).toBe('MyTestRefreshToken');

      // Assert 3: проверяем, что мутация вернула корректные данные пользователя
      expect(result.data).toEqual(testUser1);
    });

    it('Проверка если в ответе на /auth/login нет поля user', async () => {
      // Arrange: ответ без поля user
      vi.spyOn(requestModule, 'requestWithNoAuth').mockResolvedValue({
        success: true,
        accessToken: 'MyTestAccessToken',
        refreshToken: 'MyTestRefreshToken',
        // поле user на задаём
      });

      const store = setupStore();
      const dispatch = store.dispatch as AppDispatch;

      // Act
      const result = await dispatch(
        nonAuthApi.endpoints.login.initiate({
          email: 'tester1@testers.ru',
          password: 'secret123',
        })
      );

      // Assert:
      expect(result.error).toBeDefined();
      expect(result.error).toMatchObject({
        message: expect.stringContaining('User data not found in response'),
      });
    });

    it('Проверка проброса ошибки при вызове /auth/login наверх', async () => {
      // Arrange: врнём request c ошибкой авторизации
      const { RestApiError } = await import('./api-types.ts');
      vi.spyOn(requestModule, 'requestWithNoAuth').mockRejectedValue(
        new RestApiError(401, 'Unauthorized', 'Invalid credentials')
      );

      const store = setupStore();
      const dispatch = store.dispatch as AppDispatch;

      // Act
      const result = await dispatch(
        nonAuthApi.endpoints.login.initiate({
          email: testUser1.email,
          password: 'wrong',
        })
      );

      // Assert: проверяем, что ошибка пришла без искажений
      expect(result.error).toBeDefined();
      expect(result.error).toMatchObject({
        status: 401,
        statusText: 'Unauthorized',
        body: 'Invalid credentials',
        message: 'Unauthorized',
      });
    });
  });
});
