import type { JSX } from 'react';

import styles from './order-ingredient-icons.module.css';

export interface IImageInfo {
  _id: string;
  imageUrl: string;
}

interface IOrderIngredientsProps {
  imageInfos: IImageInfo[];
  lastImageOverlayText: string | undefined;
}

function OrderIngredientIcons(props: IOrderIngredientsProps): JSX.Element {
  const lastIndex = props.imageInfos.length - 1;

  return (
    <section className={styles.ingredients_line}>
      {props.imageInfos.map((imageInfo, index) => (
        <div
          key={index}
          className={styles.ingredient_circle}
          style={{
            left: `${-10 * index}px`,
            zIndex: 6 - index,
          }}
        >
          <img
            src={imageInfo.imageUrl}
            className={styles.ingredient_image}
            style={{
              opacity: index === lastIndex && !!props.lastImageOverlayText ? 0.5 : 1,
            }}
          />
          {index === lastIndex && !!props.lastImageOverlayText && (
            <span className={`${styles.last_image_label} text text_type_digits-default`}>
              {props.lastImageOverlayText}
            </span>
          )}
        </div>
      ))}
    </section>
  );
}

export default OrderIngredientIcons;
