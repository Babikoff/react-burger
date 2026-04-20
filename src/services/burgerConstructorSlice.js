import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  bun: null,
  bunFillings: [],
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructorSlice',
  initialState,
  reducers: {
    setBun: (state, action) => {
      state.bun = action.payload;
    },
    appendBunFilling: {
      reducer: (state, action) => {
        state.bunFillings.push(action.payload);
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
    },
    clearAll: (state) => {
      state.bun = null;
      state.bunFillings = [];
    },
  },
});

export const { setBun, appendBunFilling, removeBunFilling, clearAll } =
  burgerConstructorSlice.actions;

export default burgerConstructorSlice;
