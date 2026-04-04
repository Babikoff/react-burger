import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';

import styles from './ingredient.module.css';

function Ingredient({ ingredient }) {
  return (
    <li className={styles.ingredient}>
      <Counter count={1} />
      <img src={ingredient.image} />
      <div className={styles.ingredient_price}>
        <span className="text text_type_digits-default">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <div>
        <span className="text text_type_main-default">{ingredient.name}</span>
      </div>
    </li>
  );
}

export default Ingredient;
