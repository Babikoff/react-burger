import IngedientBox from '../ingredient-box/ingredient-box';

import type { JSX } from 'react';

import type { IIngredient } from '@/services/api-types';

import styles from './ingredients-group.module.css';

interface IIngredientsGroupProps {
  title: string;
  ingredients: IIngredient[];
}

function IngredientsGroup({ title, ingredients }: IIngredientsGroupProps): JSX.Element {
  return (
    <section className="mt-4 pt-4 pb-15">
      <h2 className="text text_type_main-medium">{title}</h2>
      <ul className={`${styles.ingredients_list} pr-4`}>
        {ingredients.map((ingredient) => (
          <IngedientBox key={ingredient._id} ingredient={ingredient} />
        ))}
      </ul>
    </section>
  );
}

export default IngredientsGroup;
