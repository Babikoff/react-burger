import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useState, useRef } from 'react';

import Modal from '../modal/modal.jsx';
import IngredientDetails from './ingredient-details/ingredient-details.jsx';
import IngredientsGroup from './ingredients-group/ingredients-group.jsx';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  const [selectedTab, setSelectedTab] = useState('bun');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  // Разделим данные по группам и закешируем
  const bunsData = useMemo(
    () => ingredients.filter((item) => item.type === 'bun'),
    [ingredients]
  );
  const mainPartsData = useMemo(
    () => ingredients.filter((item) => item.type === 'main'),
    [ingredients]
  );
  const saucesData = useMemo(
    () => ingredients.filter((item) => item.type === 'sauce'),
    [ingredients]
  );

  const bunGroupRef = useRef(null);
  const mainPartsGroupRef = useRef(null);
  const sauceGroupRef = useRef(null);

  function handleTabClick(eventSourceTab) {
    setSelectedTab(eventSourceTab);

    switch (eventSourceTab) {
      case 'bun':
        bunGroupRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'main':
        mainPartsGroupRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'sauce':
        sauceGroupRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }

  function handleSelectIngredient(ingredient) {
    setSelectedIngredient(ingredient);
  }

  function handleCloseModal() {
    setSelectedIngredient(null);
  }

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab value="bun" active={selectedTab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>
          <Tab value="main" active={selectedTab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
          <Tab value="sauce" active={selectedTab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>
        </ul>
      </nav>
      <section className={`${styles.ingredient_groups} custom-scroll`}>
        <section ref={bunGroupRef}>
          <IngredientsGroup
            title="Булки"
            ingredients={bunsData}
            onSelectIngredient={handleSelectIngredient}
          />
        </section>
        <section ref={mainPartsGroupRef}>
          <IngredientsGroup
            title="Начинки"
            ingredients={mainPartsData}
            onSelectIngredient={handleSelectIngredient}
          />
        </section>
        <section ref={sauceGroupRef}>
          <IngredientsGroup
            title="Соусы"
            ingredients={saucesData}
            onSelectIngredient={handleSelectIngredient}
          />
        </section>
      </section>
      {selectedIngredient && (
        <Modal header="Детали ингредиента" closeModal={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};
