import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import { getStatusText, getStatusTextColor } from '@/components/order/order-info-helper';
import OrderIngredientIcons from '@/components/order/order-ingredient-icons/order-ingredient-icons';
import { selectIngredientsData } from '@/services/ingredientsSlice';
import { useAppSelector } from '@hooks/hooks';

import type { JSX } from 'react';

import type { IImageInfo } from '@/components/order/order-ingredient-icons/order-ingredient-icons';
import type { Ingredient, IOrderDetails } from '@/services/api-types';
import type { IOrderCardOptions } from '@/services/ui-types';

import styles from './order-box.module.css';

interface IOrderBoxProps {
  order: IOrderDetails;
  orderCardOptions: IOrderCardOptions;
}

function OrderBox({ order, orderCardOptions }: IOrderBoxProps): JSX.Element {
  const location = useLocation();

  const allPossibleIngredients = useAppSelector(selectIngredientsData);
  const ingredients: Ingredient[] = order.ingredients
    .map((ingId) => allPossibleIngredients.find((ing) => ing._id === ingId))
    .filter((item): item is Ingredient => item != null);

  let ingredientImagesInfos: IImageInfo[] = [];
  ingredients.forEach((ing) => {
    if (ing.type !== 'bun') {
      ingredientImagesInfos.push({ _id: ing._id, imageUrl: ing.image_mobile });
    } else if (!ingredientImagesInfos.find((inf) => inf._id === ing._id))
      ingredientImagesInfos.push({ _id: ing._id, imageUrl: ing.image_mobile });
  });

  let totalPrice = 0;

  if (ingredients.length > 0) {
    totalPrice = ingredients
      .map((ing) => ing.price)
      .reduce((totalPrice, ingPrice) => totalPrice + ingPrice);
  }

  const maxImagesToShow = 6;
  const cutItems: number = ingredientImagesInfos.length - maxImagesToShow;
  let lastItageOverlayText: string | undefined;
  if (cutItems > 0) {
    lastItageOverlayText = '+' + String(cutItems);
    ingredientImagesInfos = ingredientImagesInfos.slice(0, maxImagesToShow);
  }

  return (
    <Link
      to={`${orderCardOptions.linkToUrl}/${order._id}`}
      state={{ backgroundLocation: location }}
      className={styles.link}
    >
      <section className={`${styles.order_card} mb-4 pl-6 pr-6 mr-2`}>
        <div className={styles.order_card_header}>
          <span className="text text_type_digits-default mt-6">#{order.number}</span>
          <div className="text text_type_main-default text_color_inactive">
            <FormattedDate date={new Date(order.createdAt)} />
          </div>
        </div>
        <div className="text text_type_main-medium mt-6">{order.name}</div>
        {orderCardOptions?.showOrderStatus && (
          <div
            className="text text_type_main-default mt-2"
            style={{ color: getStatusTextColor(order.status) }}
          >
            {getStatusText(order.status)}
          </div>
        )}
        <div className={`${styles.order_card_footer} mt-6 mb-6`}>
          <OrderIngredientIcons
            imageInfos={ingredientImagesInfos}
            lastImageOverlayText={lastItageOverlayText}
          />
          <div className={styles.total_price}>
            <span className="text text_type_digits-default mr-2">{totalPrice}</span>
            <CurrencyIcon type="primary" />
          </div>
        </div>
      </section>
    </Link>
  );
}

export default OrderBox;
