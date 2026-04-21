import { createSlice, nanoid } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const initialState = {
  bun: null,
  bunFillings: [],
  fillingsTotalPrice: 0,
  bunsPrice: 0,
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructorSlice',
  initialState,
  reducers: {
    setBun: (state, action) => {
      state.bun = action.payload;
      state.bunsPrice = action.payload.price * 2;
    },
    appendBunFilling: {
      reducer: (state, action) => {
        state.bunFillings.push(action.payload);
        state.fillingsTotalPrice += action.payload.price;
      },
      prepare: (item) => {
        return { payload: { ...item, key: nanoid() } };
      },
    },
    removeBunFilling: (state, action) => {
      state.bunFillings = state.bunFillings.filter(
        (item) => item.key !== action.payload.key
      );
      state.fillingsTotalPrice -= action.payload.price;
    },
    clearAll: (state) => {
      state.bun = null;
      state.bunFillings = [];
      state.fillingsTotalPrice = 0;
      state.bunsPrice = 0;
    },
    moveBunFilling: (state, action) => {
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
    (state) => state.burgerConstructorSlice.bunFillings,
    (state) => state.burgerConstructorSlice.bun,
    (state, ingredient) => ingredient,
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

// Мемоизированный селектор для BunCount
export const selectBunCount = createSelector(
  [(state) => state.burgerConstructorSlice.bun, (state, id) => id],
  (bun, id) => bun._id === id
);

export default burgerConstructorSlice;
export const selectBurgerConstructorSlice = (state) => state.burgerConstructorSlice;
