import { createSlice } from '@reduxjs/toolkit';

const initialState = { selectedIngredient: null };

const selectedIngredientSlice = createSlice({
  name: 'selectedIngredientDetails',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action) => {
      state.selectedIngredient = action.payload;
    },
  },
});

export const { setSelectedIngredient } = selectedIngredientSlice.actions;

export default selectedIngredientSlice;
