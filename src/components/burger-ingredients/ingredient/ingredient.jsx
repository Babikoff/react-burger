import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import { selectIngredientCount } from '../../../services/burgerConstructorSlice.js';
import { DndItemTypes } from '../../../utils/consts';

import styles from './ingredient.module.css';

function Ingredient({ ingredient }) {
  const ingredientCount = useSelector((state) =>
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
      ref={dragRef}
      className={`${isDragging && styles.ingredient_dragging} ${styles.ingredient}`}
    >
      <Link
        to={`ingredients/${ingredient._id}`}
        state={{ backgroundLocation: location }}
      >
        {ingredientCount > 0 && <Counter count={ingredientCount} />}
        <div>
          <img src={ingredient.image} alt={ingredient.name} />
          <div className={styles.ingredient_price}>
            <span className="text text_type_digits-default">{ingredient.price}</span>
            <CurrencyIcon type="primary" />
          </div>
          <div>
            <span className="text text_type_main-default">{ingredient.name}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default Ingredient;
