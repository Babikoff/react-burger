import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import IngredientsGroup from './ingredients-group/ingredients-group.jsx';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  console.log(ingredients);

  const [tab, setTab] = useState('bun');

  function handleTabClick(eventSourceTab) {
    setTab(eventSourceTab);
  }

  const bunsData = ingredients.filter((item) => item.type === 'bun');
  const mainPartsData = ingredients.filter((item) => item.type === 'main');
  const saucesData = ingredients.filter((item) => item.type === 'sauce');

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab value="bun" active={tab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>
          <Tab value="main" active={tab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
          <Tab value="sauce" active={tab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>
        </ul>
      </nav>
      <section className={`${styles.ingredient_groups} custom-scroll`}>
        <IngredientsGroup title="Булки" ingredients={bunsData} />
        <IngredientsGroup title="Начинки" ingredients={mainPartsData} />
        <IngredientsGroup title="Соусы" ingredients={saucesData} />
      </section>
    </section>
  );
};
