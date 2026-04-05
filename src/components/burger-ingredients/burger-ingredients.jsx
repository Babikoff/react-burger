import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import Modal from '../modal/modal.jsx';
import IngredientDetailsCard from './ingredient-details-card/ingredient-details-card.jsx';
import IngredientsGroup from './ingredients-group/ingredients-group.jsx';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  console.log(ingredients);

  const [selectedTab, setSelectedTab] = useState('bun');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const bunsData = ingredients.filter((item) => item.type === 'bun');
  const mainPartsData = ingredients.filter((item) => item.type === 'main');
  const saucesData = ingredients.filter((item) => item.type === 'sauce');

  function handleTabClick(eventSourceTab) {
    setSelectedTab(eventSourceTab);
  }

  function handleSelectIngredient(ingredient) {
    console.log('handleSelectIngredient', ingredient);
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
        <IngredientsGroup
          title="Булки"
          ingredients={bunsData}
          onSelectIngredient={handleSelectIngredient}
        />
        <IngredientsGroup
          title="Начинки"
          ingredients={mainPartsData}
          onSelectIngredient={handleSelectIngredient}
        />
        <IngredientsGroup
          title="Соусы"
          ingredients={saucesData}
          onSelectIngredient={handleSelectIngredient}
        />
      </section>
      {selectedIngredient && (
        <Modal header="Детали ингредиента" closeModal={handleCloseModal}>
          <IngredientDetailsCard ingredient={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};
