import { createSlice, nanoid } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { Ingredient } from './api-types';

// Интерфейс для начального состояния слайса
export interface IBurgerConstructor {
  bun?: Ingredient;
  bunFillings: Ingredient[];
  fillingsTotalPrice: number;
  bunsPrice: number;
}

interface IMovingBunFilling {
  fromIndex: number;
  toIndex: number;
}

const initialState: IBurgerConstructor = {
  bun: undefined,
  bunFillings: [],
  fillingsTotalPrice: 0,
  bunsPrice: 0,
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructorSlice',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<Ingredient>) => {
      state.bun = action.payload;
      state.bunsPrice = action.payload.price * 2;
    },
    appendBunFilling: {
      reducer: (state, action: PayloadAction<Ingredient>) => {
        state.bunFillings.push(action.payload);
        state.fillingsTotalPrice += action.payload.price;
      },
      prepare: (item: Ingredient) => {
        return { payload: { ...item, key: nanoid() } };
      },
    },
    removeBunFilling: (state, action: PayloadAction<Ingredient>) => {
      state.bunFillings = state.bunFillings.filter(
        (item) => item.key !== action.payload.key
      );
      state.fillingsTotalPrice -= action.payload.price;
    },
    clearAll: (state) => {
      state.bun = undefined;
      state.bunFillings = [];
      state.fillingsTotalPrice = 0;
      state.bunsPrice = 0;
    },
    moveBunFilling: (state, action: PayloadAction<IMovingBunFilling>) => {
      const { fromIndex, toIndex } = action.payload;

      if (fromIndex < 0 || fromIndex >= state.bunFillings.length) {
        throw new Error(`Index [${fromIndex}"] is out of array bounds`);
      }
      if (toIndex < 0 || toIndex >= state.bunFillings.length) {
        throw new Error(`Index [${toIndex}] is out of array bounds`);
      }

      const movingItem = state.bunFillings[fromIndex];
      state.bunFillings.splice(fromIndex, 1);
      state.bunFillings.splice(toIndex, 0, movingItem);
    },
  },
});

export const { setBun, appendBunFilling, removeBunFilling, clearAll, moveBunFilling } =
  burgerConstructorSlice.actions;

// Мемоизированный селектор для TotalPrice
export const selectTotalPrice = createSelector(
  (state) => state.burgerConstructorSlice.fillingsTotalPrice,
  (state) => state.burgerConstructorSlice.bunsPrice,
  (fillingsTotalPrice, bunsPrice) => fillingsTotalPrice + bunsPrice
);

// Мемоизированный селектор для IngredientCount
export const selectIngredientCount = createSelector(
  [
    (state): Ingredient[] => state.burgerConstructorSlice.bunFillings,
    (state): Ingredient => state.burgerConstructorSlice.bun,
    (state, ingredient: Ingredient): Ingredient => ingredient,
  ],
  (items, bun, ingredient) => {
    switch (ingredient.type) {
      case 'bun':
        return bun?._id === ingredient._id ? 2 : 0;
      default:
        return items.filter((item) => item._id === ingredient._id).length;
    }
  }
);

export default burgerConstructorSlice;
