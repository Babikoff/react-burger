import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import { burgerApi } from './burgerApi';

// Внутренний селектор читает из кеша RTK Query
const selectIngredientsResult = burgerApi.endpoints.getIngredients.select();

// Публичные селекторы с ингредиентами и статусами их загрузки
export const selectIsLoading = (state) =>
  selectIngredientsResult(state).isLoading ?? true;

export const selectIsFetching = (state) =>
  selectIngredientsResult(state).isFetching ?? false;

export const selectHasError = (state) => selectIngredientsResult(state).isError ?? false;

const initialState = { selectedIngredient: null };

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action) => {
      state.selectedIngredient = action.payload;
    },
  },
});

// Мемоизированный селектор для IngredientsData
export const selectIngredientsData = createSelector(
  [selectIngredientsResult],
  (result) => result.data?.data ?? []
);

export const { setSelectedIngredient } = ingredientsSlice.actions;
export default ingredientsSlice;
