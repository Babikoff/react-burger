import { useSelector } from 'react-redux';

import { selectIngredientsData } from '@/services/ingredientsSlice';

import type { JSX } from 'react';

import styles from './order-ingredients.module.css';

function OrderIngredients(): JSX.Element {
  const ingredients = useSelector(selectIngredientsData);
  return (
    <section className={styles.ingredients_line}>
      {ingredients.slice(0, 5).map((ingredient) => (
        <img
          key={ingredient._id}
          src={ingredient.image_mobile}
          className={styles.ingredient_image}
        />
      ))}
    </section>
  );
}

export default OrderIngredients;
