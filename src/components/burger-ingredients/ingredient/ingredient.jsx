import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';

import styles from './ingredient.module.css';

function Ingredient({ ingredient, onSelect }) {
  function handleListItemClick() {
    onSelect(ingredient);
  }

  function handleListItemKeyDown(event) {
    if (event.key === 'Enter') onSelect(ingredient);
  }

  return (
    <li
      className={styles.ingredient}
      onClick={handleListItemClick}
      onKeyDown={handleListItemKeyDown}
    >
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
