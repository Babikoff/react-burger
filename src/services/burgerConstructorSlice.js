import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  bun: null,
  bunFillings: [],
  fillingsTotalPrice: 0,
  bunsPrice: 0,
  totalPrice: 0,
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructorSlice',
  initialState,
  reducers: {
    setBun: (state, action) => {
      state.bun = action.payload;
      state.bunsPrice = action.payload.price * 2;
      state.totalPrice = state.fillingsTotalPrice + state.bunsPrice;
    },
    appendBunFilling: {
      reducer: (state, action) => {
        state.bunFillings.push(action.payload);
        state.fillingsTotalPrice += action.payload.price;
        state.totalPrice = state.fillingsTotalPrice + state.bunsPrice;
      },
      prepare: (item) => {
        return { payload: { ...item, key: nanoid() } };
      },
    },
    removeBunFilling: (state, action) => {
      console.log('removeItem: ', action.payload);
      state.bunFillings = state.bunFillings.filter(
        (item) => item.key !== action.payload.key
      );
      state.fillingsTotalPrice -= action.payload.price;
      state.totalPrice = state.fillingsTotalPrice + state.bunsPrice;
    },
    clearAll: (state) => {
      state.bun = null;
      state.bunFillings = [];
      state.fillingsTotalPrice = 0;
      state.bunsPrice = 0;
      state.totalPrice = 0;
    },
  },
});

export const { setBun, appendBunFilling, removeBunFilling, clearAll } =
  burgerConstructorSlice.actions;

export default burgerConstructorSlice;
