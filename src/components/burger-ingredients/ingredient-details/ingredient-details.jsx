import styles from './ingredient-details.module.css';

function IngredientDetails({ ingredient }) {
  return (
    <section className={styles.ingredient_details}>
      <img className="mt-15" src={ingredient.image_large} alt={ingredient.name} />
      <h2 className={`${styles.inredient_header} text text_type_main-medium`}>
        {ingredient.name}
      </h2>
      <div className={`${styles.inredient_params} mt-4`}>
        <div className={styles.ingredient_param}>
          <p
            className={`${styles.inredient_text} text text_type_main-default text_color_inactive`}
          >
            Калории, ккал
          </p>
          <p
            className={`${styles.inredient_text} text text_type_digits-default text_color_inactive`}
          >
            {ingredient.calories}
          </p>
        </div>
        <div className={styles.ingredient_param}>
          <p
            className={`${styles.inredient_text} text text_type_main-default text_color_inactive`}
          >
            Белки, г
          </p>
          <p
            className={`${styles.inredient_text} text text_type_digits-default text_color_inactive`}
          >
            {ingredient.proteins}
          </p>
        </div>
        <div className={styles.ingredient_param}>
          <p
            className={`${styles.inredient_text} text text_type_main-default text_color_inactive`}
          >
            Жиры, г
          </p>
          <p
            className={`${styles.inredient_text} text text_type_digits-default text_color_inactive`}
          >
            {ingredient.fat}
          </p>
        </div>
        <div className={styles.ingredient_param}>
          <p
            className={`${styles.inredient_text} text text_type_main-default text_color_inactive`}
          >
            Углеводы, г
          </p>
          <p
            className={`${styles.inredient_text} text text_type_digits-default text_color_inactive`}
          >
            {ingredient.carbohydrates}
          </p>
        </div>
      </div>
    </section>
  );
}

export default IngredientDetails;
