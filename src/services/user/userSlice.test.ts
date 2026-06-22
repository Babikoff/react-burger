import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';

import { authApi, nonAuthApi } from '@/services/api';
import { testUser1, testUser2 } from '@/utils/tests/test-data';

import { initialState, setIsAuthChecked, setUser, userReducer } from './userSlice';

import type { IUser } from '@/services/api-types';

interface ITestRootState {
  user: ReturnType<typeof userReducer>;
}

// "индивидуальный" тестовый mocked store для userSlice (на основе authApi и nonAuthApi).
function createTestStore(): ReturnType<typeof configureStore> {
  return configureStore({
    // Вместо полного rootReducer-а приложения, собираем тестовый, на основе только тех
    // редьюсеров, которые нужны в userSlice
    reducer: {
      user: userReducer,
      [authApi.reducerPath]: authApi.reducer,
      [nonAuthApi.reducerPath]: nonAuthApi.reducer,
    },
    // Эмитируем реальный Middleware, но только для authApi и nonAuthApi
    // (с которыми взаимодействует userSlice)
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware, nonAuthApi.middleware),
  });
}

describe('userSlice', () => {
  it('Проверка начального состояния', () => {
    const result = userReducer(undefined, { type: '' });

    expect(result).toEqual(initialState);
  });

  describe('Тесты для проверки установки флага IsAuthChecked', () => {
    it('Установка флага isAuthChecked в true (setIsAuthChecked)', () => {
      const action = setIsAuthChecked(true);
      const result = userReducer({ ...initialState }, action);

      expect(result.isAuthChecked).toBe(true);
    });

    it('Установка флага isAuthChecked в false (setIsAuthChecked)', () => {
      const action = setIsAuthChecked(false);
      const result = userReducer({ ...initialState, isAuthChecked: true }, action);

      expect(result.isAuthChecked).toBe(false);
    });

    it('Вызов setUser устанавливает isAuthChecked = true', () => {
      const action = setUser(true);
      const result = userReducer({ ...initialState }, action);

      expect(result.isAuthChecked).toBe(true);
    });
  });

  // Тесты для экстра-редюсеров. Проверяют автоматические установки переменных
  // глобального состояния после вызовов функций API
  describe('Проверяем автоматические установки переменных глобального состояния после вызовов функций API', () => {
    it('Ввызов /getuser сохраняет пользователя в state', () => {
      const store = createTestStore();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store.dispatch as any)({
        type: 'authApi/executeQuery/fulfilled',
        payload: testUser1,
        meta: {
          requestId: 'test-request',
          requestStatus: 'fulfilled',
          arg: { endpointName: 'getUser' },
        },
      });

      const state = (store.getState() as ITestRootState).user;
      expect(state.user).toEqual(testUser1);
    });

    it('Вызов /login сохраняет пользователя в state и isAuthChecked = true', () => {
      const store = createTestStore();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store.dispatch as any)({
        type: 'nonAuthApi/executeMutation/fulfilled',
        payload: testUser1,
        meta: {
          requestId: 'test-request',
          requestStatus: 'fulfilled',
          arg: { endpointName: 'login' },
        },
      });

      const state = (store.getState() as ITestRootState).user;
      expect(state.user).toEqual(testUser1);
      expect(state.isAuthChecked).toBe(true);
    });

    it('Вызов /register сохраняет пользователя в state и isAuthChecked=true', () => {
      const newUser: IUser = testUser2;
      const store = createTestStore();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store.dispatch as any)({
        type: 'nonAuthApi/executeMutation/fulfilled',
        payload: newUser,
        meta: {
          requestId: 'test-request',
          requestStatus: 'fulfilled',
          arg: { endpointName: 'register' },
        },
      });

      const state = (store.getState() as ITestRootState).user;
      expect(state.user).toEqual(newUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('Вызов /register удаляет пользователя из state', () => {
      const store = createTestStore();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store.dispatch as any)({
        type: 'authApi/executeQuery/fulfilled',
        payload: testUser1, // устанавливаем пользователя, который сделает logout
        meta: {
          requestId: 'test-request',
          requestStatus: 'fulfilled',
          arg: { endpointName: 'getUser' },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (store.dispatch as any)({
        type: 'authApi/executeMutation/fulfilled',
        payload: { success: true },
        meta: {
          requestId: 'test-request-2',
          requestStatus: 'fulfilled',
          arg: { endpointName: 'logout' },
        },
      });

      const state = (store.getState() as ITestRootState).user;
      expect(state.user).toBeUndefined();
      expect(state.isAuthChecked).toBe(false);
    });
  });
});
