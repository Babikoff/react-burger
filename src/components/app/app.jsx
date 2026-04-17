import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import { useGetIngredientsQuery } from '../api/burgerApi';

import styles from './app.module.css';

export const App = () => {
  const {
    data: ingredients = {},
    isLoading = true,
    //isFetching = true,
    isError: hasError = false,
  } = useGetIngredientsQuery();

  console.log('api', ingredients);

  return (
    <div className={styles.app}>
      <AppHeader />
      {!isLoading && !hasError && (
        <>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients ingredients={ingredients.data} />
            <BurgerConstructor ingredients={ingredients.data} />
          </main>
        </>
      )}
      {hasError && (
        <h2 className={`${styles.error_message} text text_type_main-large`}>
          Произошла ошибка загрузки данных.
        </h2>
      )}
      {isLoading && <Preloader />}
    </div>
  );
};
