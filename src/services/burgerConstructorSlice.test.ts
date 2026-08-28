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
  moveBunFilling,
  removeBunFilling,
  clearAll,
  selectIngredientCount,
  selectTotalPrice,
} from './burgerConstructorSlice';

describe('burgerConstructorSlice', () => {
  it('Проверка начального состояния', () => {
    const result = burgerConstructorReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('Тесты добавления ингредиентов (addIngrediednt)', () => {
    it('Первое добавление булки', () => {
      const action = addIngrediednt(testBun1);
      const result = burgerConstructorReducer({ ...initialState }, action);
      expect(result.bun).toMatchObject(testBun1);
      expect(result.bunFillings.length).toBe(0);
    });

    it('Замена булки', () => {
      // Установим начальное тестовое состояние с учётом добавления одной булки
      const stateWithBun = { ...initialState, bun: testBun1 };
      const action = addIngrediednt(testBun2);
      const result = burgerConstructorReducer({ ...stateWithBun }, action);
      expect(result.bun).toMatchObject(testBun2);
    });

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
      expect(result2.bunFillings[0]).toMatchObject(testBunFilling1);
      expect(result2.bunFillings[1]).toMatchObject(testBunFilling2);
    });
  });

  describe('Тесты перемещения ингредиентов (moveBunFilling)', () => {
    it('Перемещение двух ингредиентов', () => {
      // Установим начальное тестовое состояние
      const stateWith2BunFillings = {
        ...initialState,
        bunFillings: [testBunFilling1, testBunFilling2],
      };

      // Проверим, что до начала перемещений, ингредиенты установлены как нужно
      const initialTestState = burgerConstructorReducer(
        { ...stateWith2BunFillings },
        { type: '' }
      );
      expect(initialTestState.bunFillings[0]).toMatchObject(testBunFilling1);
      expect(initialTestState.bunFillings[1]).toMatchObject(testBunFilling2);

      const action = moveBunFilling({ fromIndex: 0, toIndex: 1 });
      const result = burgerConstructorReducer({ ...stateWith2BunFillings }, action);

      expect(result.bunFillings[0]).toMatchObject(testBunFilling2);
      expect(result.bunFillings[1]).toMatchObject(testBunFilling1);
    });
  });

  describe('Тесты удаления ингредиентов наполнения булки (removeBunFilling)', () => {
    it('Удаление ингредиента', () => {
      // Установим начальное тестовое состояние
      const stateWithBunFilling = {
        ...initialState,
        bunFillings: [testBunFilling1],
      };

      const action = removeBunFilling(testBunFilling1);
      const result = burgerConstructorReducer({ ...stateWithBunFilling }, action);

      expect(result.bunFillings.length).toBe(0);
    });
  });

  describe('Тесты удаления всех ингредиентов (и булки) (clearAll)', () => {
    it('Удаление ингредиента', () => {
      // Установим начальное тестовое состояние
      const stateWithBunFilling = {
        ...initialState,
        bun: testBun1,
        bunFillings: [testBunFilling1],
      };

      const action = clearAll();
      const result = burgerConstructorReducer({ ...stateWithBunFilling }, action);

      expect(result.bunFillings.length).toBe(0);
      expect(result.bun).not.toBeDefined();
    });
  });

  describe('Тесты селекторов', () => {
    it('Проверка правильности подсчёта счётчиков вхождения ингредиентов в бургер (selectIngredientCount)', () => {
      // Установим начальное тестовое состояние
      const stateWithBunAndFilling = {
        burgerConstructorSlice: {
          ...initialState,
          bun: testBun1,
          bunFillings: [testBunFilling1],
        },
      };

      // Проверяем счётчик булок
      const resultForBun = selectIngredientCount(stateWithBunAndFilling, testBun1);
      expect(resultForBun).toBe(2);

      // Проверяем счётчик для ингредиента
      const resultForFilling = selectIngredientCount(
        stateWithBunAndFilling,
        testBunFilling1
      );
      expect(resultForFilling).toBe(1);
    });

    it('Проверка правильности подсчёта цены бургера (selectTotalPrice)', () => {
      const action1 = addIngrediednt(testBun1);
      const result1 = burgerConstructorReducer(undefined, action1);

      const action2 = addIngrediednt(testBunFilling1);
      const result2 = burgerConstructorReducer({ ...result1 }, action2);

      // Проверяем счётчик булок
      const result = selectTotalPrice({ burgerConstructorSlice: result2 });
      expect(result).toBe(5510);
    });
  });
});
