import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useState, useRef, type JSX } from 'react';

import { selectIngredientsData } from '@/services/ingredientsSlice';
import { useAppSelector } from '@hooks/hooks';

import IngredientsGroup from './ingredients-group/ingredients-group.tsx';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): JSX.Element => {
  const ingredients = useAppSelector(selectIngredientsData);
  const [selectedTab, setSelectedTab] = useState('bun');

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

  const bunGroupRef = useRef<HTMLDivElement>(null);
  const mainPartsGroupRef = useRef<HTMLDivElement>(null);
  const sauceGroupRef = useRef<HTMLDivElement>(null);

  function handleTabClick(newTab: string): void {
    setSelectedTab(newTab);

    switch (newTab) {
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

  function adjustSelectedTab(tabName: string): void {
    if (selectedTab !== tabName) {
      setSelectedTab(tabName);
    }
  }

  function handleIngredientsScroll(): void {
    const bunsGroupRect = bunGroupRef?.current?.getBoundingClientRect();
    const mainPartsGroupRect = mainPartsGroupRef?.current?.getBoundingClientRect();
    const sauceGroupRect = sauceGroupRef?.current?.getBoundingClientRect();

    if (bunsGroupRect && mainPartsGroupRect && sauceGroupRect) {
      if (bunsGroupRect.top > 0) {
        adjustSelectedTab('bun');
      } else if (mainPartsGroupRect.top > 0) {
        adjustSelectedTab('main');
      } else {
        adjustSelectedTab('sauce');
      }
    }
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
      <section
        className={`${styles.ingredient_groups} custom-scroll`}
        onScroll={handleIngredientsScroll}
      >
        <section ref={bunGroupRef}>
          <IngredientsGroup title="Булки" ingredients={bunsData} />
        </section>
        <section ref={mainPartsGroupRef}>
          <IngredientsGroup title="Начинки" ingredients={mainPartsData} />
        </section>
        <section ref={sauceGroupRef}>
          <IngredientsGroup title="Соусы" ingredients={saucesData} />
        </section>
      </section>
    </section>
  );
};
