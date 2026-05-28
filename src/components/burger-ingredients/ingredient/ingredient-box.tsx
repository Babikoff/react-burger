import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

import { useAppSelector } from '@hooks/hooks';
import { selectIngredientCount } from '@services/burgerConstructorSlice';
import { DndItemTypes } from '@utils/appConstants';

import type { JSX } from 'react';

import type { Ingredient } from '@services/api_types';

import styles from './ingredient-box.module.css';

interface IIngredientBoxProps {
  ingredient: Ingredient;
}

function IngredientBox({ ingredient }: IIngredientBoxProps): JSX.Element {
  const ingredientCount = useAppSelector((state) =>
    selectIngredientCount(state, ingredient)
  );

  const location = useLocation();

  const [{ isDragging }, dragRef] = useDrag({
    type: DndItemTypes.Ingredient,
    item: { ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <li
      ref={(node) => {
        if (node) dragRef(node);
      }}
      className={`${isDragging && styles.ingredient_dragging} ${styles.ingredient}`}
    >
      <Link
        to={`ingredients/${ingredient._id}`}
        state={{ backgroundLocation: location }}
        className={styles.ingredient_link}
      >
        {ingredientCount > 0 && <Counter count={ingredientCount} />}
        <div>
          <img src={ingredient.image} alt={ingredient.name} />
          <div className={styles.ingredient_price}>
            <span className="text text_type_digits-default">{ingredient.price}</span>
            <CurrencyIcon type="primary" />
          </div>
          <div className={`${styles.ingredient_name} pl-1`}>
            <span className="text text_type_main-default">{ingredient.name}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default IngredientBox;
