import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import { getStatusText, getStatusTextColor } from '@/components/order/order-info-helper';
import { selectIngredientsData } from '@/services/ingredientsSlice';

import type { JSX } from 'react';

import type { Ingredient, IOrderDetails } from '@/services/api-types';

import styles from './order-full-info.module.css';

function OrderFullInfo(): JSX.Element {
  const order: IOrderDetails = {
    _id: '111',
    number: 222,
    name: 'My name name name name name name name',
    status: 'done',
    createdAt: '2002-01-01',
    updatedAt: '2002-01-01',
    ingredients: [
      '692889f16bf770001bfeb4cc',
      '692889f16bf770001bfeb4d6',
      '692889f16bf770001bfeb4cc',
    ],
  };
  const allPossibleIngredients = useSelector(selectIngredientsData);

  const ingredients: Ingredient[] = order.ingredients
    .map((ingId) => allPossibleIngredients.find((ing) => ing._id === ingId))
    .filter((item): item is Ingredient => item != null);

  let totalPrice = 0;

  if (ingredients.length > 0) {
    totalPrice = ingredients
      .map((ing) => ing.price)
      .reduce((totalPrice, ingPrice) => totalPrice + ingPrice);
  }

  return (
    <section className={`${styles.order_full_info}`}>
      <header className={`${styles.order_header}`}>
        <div className={`${styles.order_number}`}>
          <div className={`text text_type_digits-default mb-6`}>#{order.number}</div>
        </div>
        <div className="text text_type_main-medium mt-10">{order.name}</div>
        <div
          className="text text_type_main-default mt-3"
          style={{ color: getStatusTextColor(order.status) }}
        >
          {getStatusText(order.status)}
        </div>
      </header>
      <main className={`${styles.main_section} mt-15`}>
        <header className="text text_type_main-medium">Состав:</header>
        <section className="mt-6 mr-6">
          <ul className={styles.ingredients_list}>
            {ingredients.map((ing, index) => (
              <li key={index} className={`${styles.list_line} mt-2 mb-2`}>
                <div className={styles.ingredient_item}>
                  <div className={styles.ingredient_circle}>
                    <img src={ing.image_mobile} className={styles.ingredient_image} />
                  </div>
                  <div className="text text_type_main-default ml-4">{ing.name}</div>
                </div>
                <div className={styles.total_price}>
                  <span className="text text_type_digits-default mr-2">{ing.price}</span>
                  <CurrencyIcon type="primary" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className={`${styles.order_footer} mt-10`}>
        <div className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </div>
        <div className={styles.total_price}>
          <span className="text text_type_digits-default mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </footer>
    </section>
  );
}

export default OrderFullInfo;
