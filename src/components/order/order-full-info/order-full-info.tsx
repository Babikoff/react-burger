import {
  CurrencyIcon,
  FormattedDate,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import { getStatusText, getStatusTextColor } from '@/components/order/order-info-helper';
import { useGetOrderQuery } from '@/services/api';
import { selectIngredientsData } from '@/services/ingredientsSlice';

import type { JSX } from 'react';

import type { Ingredient } from '@/services/api-types';

import styles from './order-full-info.module.css';

function OrderFullInfo(): JSX.Element {
  const {
    data: order,
    isLoading,
    isFetching,
  } = useGetOrderQuery('6a16e58a41cff5001b6e32d0', undefined);

  const allPossibleIngredients = useSelector(selectIngredientsData);

  if (!order || isLoading || isFetching) return <Preloader />;

  const ingredients: Ingredient[] = [];

  if (order.ingredients) {
    order.ingredients.forEach((ingId) => {
      const fullIngInfo = allPossibleIngredients.find((ing) => ing._id === ingId);
      if (fullIngInfo) ingredients.push(fullIngInfo);
    });
  }

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
                    <img
                      src={ing.image_mobile}
                      alt={ing.name}
                      className={styles.ingredient_image}
                    />
                  </div>
                  <div className="text text_type_main-default ml-4">{ing.name}</div>
                </div>
                <div className={`${styles.total_price} ml-3`}>
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
