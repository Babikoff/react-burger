import {
  CurrencyIcon,
  FormattedDate,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useMatch, useParams } from 'react-router-dom';

import { getStatusText, getStatusTextColor } from '@/components/order/order-info-helper';
import { useLazyGetOrderQuery } from '@/services/api';
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
  const location = useLocation();
  const isModalView = !!location.state?.backgroundLocation;

  let cachedOrderDetails: IOrderDetails | undefined = undefined;

  const userOrders: IOrdersData = useGetUserOrdersQuery(undefined, {
    skip: !isModalView || !userProfileRouteIsActive,
  });

  if (
    isModalView &&
    userOrders &&
    userOrders.data &&
    userOrders.data.orders.length > 0 &&
    params.id
  ) {
    cachedOrderDetails = userOrders.data.orders.find((ord) => ord._id === params.id);
    if (cachedOrderDetails) console.log('Using cached order info from user history.');
  }

  const allOrders: IOrdersData = useGetAllOrdersQuery(undefined, {
    skip: !isModalView || !feedPageRouteIsActive || !!cachedOrderDetails,
  });

  if (
    isModalView &&
    !cachedOrderDetails &&
    allOrders &&
    allOrders.data &&
    allOrders.data.orders.length > 0 &&
    params.id
  ) {
    cachedOrderDetails = allOrders.data.orders.find((ord) => ord._id === params.id);
    if (cachedOrderDetails) console.log('Using cached order info from feed.');
  }

  const [
    triggerGetOrder,
    { data: restOrder, isLoading: restLoading, isFetching: restFetching },
  ] = useLazyGetOrderQuery();

  if (restOrder) {
    console.log('Using order info loaded by REST');
  }

  // Определяем, получены ли уже данные из кэша WebSocket API
  const anyWsLoading =
    (userProfileRouteIsActive && userOrders.isLoading) ||
    (feedPageRouteIsActive && allOrders.isLoading);

  // Запоминаем, что REST уже был вызван
  // (чтобы не вызвать повторно при перерендерах на старте)
  const restTriggeredRef = useRef(false);

  // Ждём завершения обращения к WebSocket, и только
  // если не нашли там заказ — вызываем поиск через REST
  useEffect(() => {
    if (!params.id) return;
    if (cachedOrderDetails) return; // уже нашли в кеше WebSocket API
    if (anyWsLoading) return; // WS ещё грузятся, ждём
    if (restTriggeredRef.current) return; // REST уже вызван

    restTriggeredRef.current = true;
    triggerGetOrder(params.id);
  }, [params.id, cachedOrderDetails, anyWsLoading, triggerGetOrder]);

  const order = cachedOrderDetails ?? restOrder;

  const allPossibleIngredients = useSelector(selectIngredientsData);

  // Показываем прелоадер, если нет данных и какой-то из запросов всё ещё выполняется
  if (!order || (!cachedOrderDetails && (anyWsLoading || restLoading || restFetching)))
    return <Preloader />;

  const ingredients: Ingredient[] = [];

  if (order.ingredients) {
    order.ingredients.forEach((ingId: string) => {
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
