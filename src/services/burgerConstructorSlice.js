import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  fillings: [],
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructorSlice',
  initialState,
  reducers: {
    appendItem: {
      reducer: (state, action) => {
        state.fillings.push(action.payload);
      },
      prepare: (item) => {
        return { payload: { ...item, key: nanoid() } };
      },
    },
    removeItem: (state, action) => {
      console.log('removeItem: ', action.payload);
      state.fillings = state.fillings.filter((item) => item.key !== action.payload.key);
    },
    removeAllItems: (state) => {
      state.fillings = [];
    },
  },
});

export const { appendItem, removeItem, removeAllItems } = burgerConstructorSlice.actions;

export default burgerConstructorSlice;
