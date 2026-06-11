import {
  CurrencyIcon,
  FormattedDate,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { useMatch, useParams } from 'react-router-dom';

import { getStatusText, getStatusTextColor } from '@/components/order/order-info-helper';
import { useGetOrderQuery } from '@/services/api';
import { selectIngredientsData } from '@/services/ingredientsSlice';
import { useGetAllOrdersQuery, useGetUserOrdersQuery } from '@/services/ws-api';

import type { JSX } from 'react';

import type { Ingredient, IOrdersData, IOrderDetails } from '@/services/api-types';

import styles from './order-full-info.module.css';

interface IIngredientWithCount {
  ingredient: Ingredient;
  count: number;
}

function OrderFullInfo(): JSX.Element {
  const params = useParams<{ id: string }>();

  const userProfileRouteIsActive = !!useMatch('/profile/orders/:id');
  const feedPageRouteIsActive = !!useMatch('/feed/:id');

  let cachedOrderDetails: IOrderDetails | undefined = undefined;

  const userOrders: IOrdersData = useGetUserOrdersQuery(undefined, {
    skip: !userProfileRouteIsActive,
  });

  if (userOrders && userOrders.data && userOrders.data.orders.length > 0 && params.id) {
    cachedOrderDetails = userOrders.data.orders.find((ord) => ord._id === params.id);
    if (cachedOrderDetails) console.log('Using cached order info from user history.');
  }

  const allOrders: IOrdersData = useGetAllOrdersQuery(undefined, {
    skip: !feedPageRouteIsActive || !!cachedOrderDetails,
  });

  if (
    !cachedOrderDetails &&
    allOrders &&
    allOrders.data &&
    allOrders.data.orders.length > 0 &&
    params.id
  ) {
    cachedOrderDetails = allOrders.data.orders.find((ord) => ord._id === params.id);
    if (cachedOrderDetails)
      console.log('Using cached order info from feed', cachedOrderDetails);
  }

  const { data, isLoading, isFetching } = useGetOrderQuery(params.id ?? '', {
    skip: !!cachedOrderDetails,
  });

  if (data) {
    console.log('Using order info loaded by REST', data);
  }

  const order = cachedOrderDetails ?? data;

  const allPossibleIngredients = useSelector(selectIngredientsData);

  if (!order || isLoading || isFetching) return <Preloader />;

  const ingredients: Ingredient[] = [];

  if (order.ingredients) {
    order.ingredients.forEach((ingId) => {
      const fullIngInfo = allPossibleIngredients.find((ing) => ing._id === ingId);
      if (fullIngInfo) ingredients.push(fullIngInfo);
    });
  }

  const ingredientsWithCounts: IIngredientWithCount[] = ingredients.reduce<
    IIngredientWithCount[]
  >((acc, ing) => {
    const addedIng = acc.find((item) => item.ingredient._id === ing._id);
    if (addedIng) {
      addedIng.count += 1;
    } else {
      acc.push({ ingredient: ing, count: 1 });
    }
    return acc;
  }, []);

  let totalPrice = 0;

  if (ingredients.length > 0) {
    totalPrice = ingredients
      .map((ing) => ing.price)
      .reduce((totalPrice, ingPrice) => totalPrice + ingPrice);
  }

  return (
    <section className={`${styles.order_full_info} mt-10`}>
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
            {ingredientsWithCounts.map((ing, index) => (
              <li key={index} className={`${styles.list_line} mt-2 mb-2`}>
                <div className={styles.ingredient_item}>
                  <div className={styles.ingredient_circle}>
                    <img
                      src={ing.ingredient.image_mobile}
                      alt={ing.ingredient.name}
                      className={styles.ingredient_image}
                    />
                  </div>
                  <div className="text text_type_main-default ml-4">
                    {ing.ingredient.name}
                  </div>
                </div>
                <div className={`${styles.total_price} ml-3`}>
                  <span className="text text_type_digits-default mr-2">
                    {ing.count} x {ing.ingredient.price}
                  </span>
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
