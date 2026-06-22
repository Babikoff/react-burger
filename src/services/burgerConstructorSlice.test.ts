import { describe, it, expect } from 'vitest';

import {
  testBun1,
  testBun2,
  testBunFilling1,
  testBunFilling2,
} from '@/utils/tests/test-data';

import {
  burgerConstructorReducer,
  initialState,
  addIngrediednt,
  // removeBunFilling,
  // clearAll,
  // selectIngredientCount,
} from './burgerConstructorSlice';

describe('burgerConstructorSlice', () => {
  it('Проверка начального состояния', () => {
    const result = burgerConstructorReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('Тесты добавления булок (addIngrediednt)', () => {
    it('Первое добавление булки', () => {
      const action = addIngrediednt(testBun1);
      const result = burgerConstructorReducer({ ...initialState }, action);
      expect(result.bun).toMatchObject(testBun1);
      expect(result.bunFillings.length).toBe(0);
    });

    it('Замена булки', () => {
      const action1 = addIngrediednt(testBun1);
      const result1 = burgerConstructorReducer({ ...initialState }, action1);
      expect(result1.bun).toMatchObject(testBun1);
      const action2 = addIngrediednt(testBun2);
      const result2 = burgerConstructorReducer({ ...initialState }, action2);
      expect(result2.bun).toMatchObject(testBun2);
    });
  });

  describe('Тесты добавления ингредиентов (appendBunFilling)', () => {
    it('Добавление двух ингредиентов', () => {
      const action1 = addIngrediednt(testBunFilling1);
      const result1 = burgerConstructorReducer({ ...initialState }, action1);
      expect(result1.bunFillings.length).toBe(1);
      expect(result1.bunFillings[0]).toMatchObject(testBunFilling1);

      // Скорректируем тестовое состояние с учётом добавления первого ингедиента
      const stateWithBunFilling1 = {
        ...initialState,
        bunFillings: [testBunFilling1],
      };

      const action2 = addIngrediednt(testBunFilling2);
      const result2 = burgerConstructorReducer({ ...stateWithBunFilling1 }, action2);
      expect(result2.bunFillings.length).toBe(2);
      expect(result1.bunFillings[0]).toMatchObject(testBunFilling1);
      expect(result2.bunFillings[1]).toMatchObject(testBunFilling2);
    });
  });
});
