import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';

import { testBun1, testBun2 } from '@/utils/tests/test-data';

import { authApi } from './api';
import {
  initialState,
  ingredientsReducer,
  selectIngredientsResult,
  setSelectedIngredient,
} from './ingredientsSlice';

// "индивидуальный" тестовый мини store (только для authApi).
function setupStore(): ReturnType<typeof configureStore> {
  return configureStore({
    reducer: { [authApi.reducerPath]: authApi.reducer },
    // Эмитируем реальный Middleware, но только для authApi
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
  });
}

describe('ingredientsSlice', () => {
  it('Проверка начального состояния', () => {
    const result = ingredientsReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('Установка текущего ингредиента (setSelectedIngredient)', () => {
    const action = setSelectedIngredient(testBun1);
    const result = ingredientsReducer({ ...initialState }, action);
    expect(result.selectedIngredient).toMatchObject(testBun1);
  });

  describe('Тесты селектора selectIngredientsResult', () => {
    /**
     * Тест проверяет, что селектор корректно читает данные из кэша RTK Query.
     * Для этого мы напрямую заполняем кэш через upsertQueryData,
     * что позволяет протестировать логику селектора без HTTP-запросов.
     **/
    it('Возвращает данные ингредиентов при заполненном кэше', async () => {
      const store = setupStore();

      // Mock response с данными
      const mockApiResponse = {
        success: true,
        data: [testBun1, testBun2],
      };

      // Заполняем кэш RTKQuery данными, которые нам должен вернуть authApi
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (store.dispatch as any)(
        authApi.util.upsertQueryData('getIngredients', undefined, mockApiResponse)
      );

      // Act: вызываем тестируемый селектор
      const state = store.getState() as { authApi: ReturnType<typeof authApi.reducer> };
      const result = selectIngredientsResult(state);

      // Проверяем статусы успешной загрузки
      expect(result.isSuccess).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.isFetching).toBe(false);
      expect(result.isError).toBe(false);

      // Проверяем загруженные данные
      expect(result.data).toEqual(mockApiResponse);
      expect(result.data?.data.length).toBe(2);
      expect(result.data?.data[0]).toMatchObject(testBun1);
      expect(result.data?.data[1]).toMatchObject(testBun2);
    });

    it('Возвращает состояние загрузки, если кэш пуст', () => {
      // Создаём store,
      const store = setupStore();
      // но данные в store не кладём

      // Вызываем селектор пустом store
      const state = store.getState() as { authApi: ReturnType<typeof authApi.reducer> };
      const result = selectIngredientsResult(state);

      // Проверяем, что можно определить состояния ожидания данных
      expect(result.isSuccess).toBe(false);
      expect(result.isLoading).toBe(true);
      expect(result.isFetching).toBe(false);
      expect(result.isError).toBe(false);

      // Проверяем что данных нет
      expect(result.data).toBeUndefined();
    });
  });
});
