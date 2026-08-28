import { createSlice } from '@reduxjs/toolkit';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { createSelector } from 'reselect';

import { authApi } from './api';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { IIngredient } from './api-types';

// Внутренний селектор загрузки ингредиентов
const selectIngredientsRaw = authApi.endpoints.getIngredients.select(undefined);

// Публичные мемоизированные селекторы с ингредиентами и статусами их загрузки
export const selectIsLoading = createSelector(
  [selectIngredientsRaw],
  (result): boolean =>
    result.status === QueryStatus.pending || result.status === QueryStatus.uninitialized
);

export const selectIsFetching = createSelector(
  [selectIngredientsRaw],
  (result): boolean => result.status === QueryStatus.pending
);

export const selectHasError = createSelector(
  [selectIngredientsRaw],
  (result): boolean => result.status === QueryStatus.rejected
);

export const selectIngredientsResult = createSelector(
  [selectIngredientsRaw],
  (result) => {
    return {
      data: result.data,
      isLoading:
        result.status === QueryStatus.pending ||
        result.status === QueryStatus.uninitialized,
      isFetching: result.status === QueryStatus.pending,
      isError: result.status === QueryStatus.rejected,
      isSuccess: result.status === QueryStatus.fulfilled,
      status: result.status,
    } as {
      data?: { success: boolean; data: IIngredient[] };
      isLoading: boolean;
      isFetching: boolean;
      isError: boolean;
      isSuccess: boolean;
      status: QueryStatus;
    };
  }
);

// Объекты для слайса

// Интерфейс для начального состояния слайса
interface ISelectedIngredient {
  selectedIngredient?: IIngredient;
}

// Начальное состояние слайса
export const initialState: ISelectedIngredient = { selectedIngredient: undefined };

// Слайс
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action: PayloadAction<IIngredient>) => {
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
export const { reducer: ingredientsReducer } = ingredientsSlice;
export default ingredientsSlice;
