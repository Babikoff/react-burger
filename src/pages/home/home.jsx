import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import {
  selectHasError,
  selectIsFetching,
  selectIsLoading,
} from '../../services/ingredientsSlice';

import styles from './home.module.css';

export const Home = () => {
  const isLoading = useSelector(selectIsLoading);
  const isFetching = useSelector(selectIsFetching);
  const hasError = useSelector(selectHasError);

  return (
    <div className={styles.app}>
      {!isLoading && !hasError && (
        <DndProvider backend={HTML5Backend}>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </main>
        </DndProvider>
      )}
      {hasError && (
        <h2 className={`${styles.error_message} text text_type_main-large`}>
          Произошла ошибка загрузки данных.
        </h2>
      )}
      {(isLoading || isFetching) && <Preloader />}
    </div>
  );
};
