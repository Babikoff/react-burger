import Ingedient from '../ingredient/ingredient.jsx';

import styles from './ingredients-group.module.css';

function IngredientsGroup({ title, ingredients /*, onSelectIngredient*/ }) {
  return (
    <section className="mt-4 pt-4 pb-15">
      <h2 className="text text_type_main-medium">{title}</h2>
      <ul className={`${styles.ingredients_list} pr-4`}>
        {ingredients.map((ingredient) => (
          <Ingedient key={ingredient._id} ingredient={ingredient} />
        ))}
      </ul>
    </section>
  );
}

export default IngredientsGroup;
