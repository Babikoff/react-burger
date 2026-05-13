import IngredientDetails from '@components/burger-ingredients/ingredient-details/ingredient-details';

import styles from './ingredient-details-page.module.css';

export const IngredientDetailsPage = () => {
  return (
    <div className={styles.app}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <IngredientDetails />
    </div>
  );
};
