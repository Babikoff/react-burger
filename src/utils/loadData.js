import { ingredientsApiUrl } from './consts.js';

/**
 * Загружает ингредиенты с сервера.
 * @returns {Promise<Array>} Массив ингредиентов
 * @throws {Error}
 */
export async function fetchIngredients() {
  const response = await fetch(ingredientsApiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch ingredients: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
