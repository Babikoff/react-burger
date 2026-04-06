import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { ingredientsApiUrl } from '@utils/consts.js';
import { ingredients } from '@utils/ingredients';

import styles from './app.module.css';

export const App = () => {
  const [ingredientsData, setIngredientsData] = useState({
    ingredients: [],
    isLoading: true,
    hasError: false,
  });

  useEffect(() => {
    function loadIngredientsData() {
      setIngredientsData({ ...ingredientsData, isLoading: true, hasError: false });
      return fetch(ingredientsApiUrl)
        .then((result) => {
          console.log(result);
          if (!result.ok) {
            result.reject(result.statusText);
          }
          return result.json();
        })
        .then((data) => {
          console.log(data);
          setIngredientsData({
            ...ingredientsData,
            ingredients: data,
            isLoading: false,
            hasError: false,
          });
        })
        .catch((error) => {
          console.log(error);
          setIngredientsData({ ...ingredientsData, isLoading: false, hasError: true });
        });
    }
    loadIngredientsData();
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      {!ingredientsData.isLoading && !ingredientsData.hasError && (
        <>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients ingredients={ingredients} />
            <BurgerConstructor ingredients={ingredients} />
          </main>
        </>
      )}
      {ingredientsData.hasError && (
        <h2 className={`${styles.error_message} text text_type_main-large`}>
          Произошла ошибка загрузки данных.
        </h2>
      )}
      {ingredientsData.isLoading && <Preloader />}
    </div>
  );
};
