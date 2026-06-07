import { useSelector } from 'react-redux';

import { selectIngredientsData } from '@/services/ingredientsSlice';

import type { JSX } from 'react';

import styles from './order-ingredients.module.css';

function OrderIngredients(): JSX.Element {
  const ingredients = useSelector(selectIngredientsData).slice(0, 5);
  const lastIndex = ingredients.length - 1;
  const lastItemText = '+2';
  return (
    <section className={styles.ingredients_line}>
      {ingredients.map((ingredient, index) => (
        <div
          key={ingredient._id}
          className={styles.ingredient_circle}
          style={{
            left: `${-20 * index}px`,
            zIndex: 6 - index,
          }}
        >
          <img src={ingredient.image_mobile} className={styles.ingredient_image} />
          {index === lastIndex && !!lastItemText && (
            <span className={`${styles.last_image_label} text text_type_digits-default`}>
              {lastItemText}
            </span>
          )}
        </div>
      ))}
    </section>
  );
}

export default OrderIngredients;
