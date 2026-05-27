import { createSlice } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { createSelector } from 'reselect';

import { authApi } from './api';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { Ingredient } from './api_types';
import type { RootState } from './store';

// Внутренний селектор читает из кеша RTK Query и мэппит QueryStatus на
// уже используемые в приложении структуры данных и переменные
const selectIngredientsResult = (
  state: RootState
): {
  data?: { success: boolean; data: Ingredient[] };
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  status: QueryStatus;
} => {
  const result = authApi.endpoints.getIngredients.select(undefined)(state);
  return {
    data: result.data,
    isLoading:
      result.status === QueryStatus.pending ||
      result.status === QueryStatus.uninitialized,
    isFetching: result.status === QueryStatus.pending,
    isError: result.status === QueryStatus.rejected,
    isSuccess: result.status === QueryStatus.fulfilled,
    status: result.status,
  };
};

// Публичные селекторы с ингредиентами и статусами их загрузки
export const selectIsLoading = (state: RootState): boolean =>
  selectIngredientsResult(state).isLoading ?? true;

export const selectIsFetching = (state: RootState): boolean =>
  selectIngredientsResult(state).isFetching ?? false;

export const selectHasError = (state: RootState): boolean =>
  selectIngredientsResult(state).isError ?? false;

interface ISelectedIngredient {
  selectedIngredient?: Ingredient;
}

const initialState: ISelectedIngredient = { selectedIngredient: undefined };

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action: PayloadAction<Ingredient>) => {
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
