import Ingedient from '../ingredient/ingredient.jsx';

import styles from './ingredients-group.module.css';

function IngredientsGroup({ title, ingredients, onSelectIngredient }) {
  return (
    <section className={styles.ingredients_group}>
      <h2 className="text text_type_main-medium">{title}</h2>
      <ul className={styles.ingredients_list}>
        {ingredients.map((ingredient) => (
          <Ingedient
            key={ingredient._id}
            ingredient={ingredient}
            onSelect={onSelectIngredient}
          />
        ))}
      </ul>
    </section>
  );
}

export default IngredientsGroup;
