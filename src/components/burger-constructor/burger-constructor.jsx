import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { useCreateOrderMutation } from '../../api/burgerApi.js';
import withSwing from '../../hocs/with-swing.jsx';
import {
  setBun,
  appendBunFilling,
  removeBunFilling,
  clearAll,
  moveBunFilling,
} from '../../services/burgerConstructorSlice.js';
import { DndItemTypes } from '../../utils/consts.js';
import Modal from '../modal/modal.jsx';
import OrderDetails from './order-details/order-details.jsx';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [isOrderCardOpen, setIsOrderCardOpen] = useState(false);
  const [isErrorMessageOpen, setIsErrorMessageOpen] = useState(false);

  const [createOrderMutation] = useCreateOrderMutation();

  // Ссылки на булку и начинку в глобальном хранилище
  const {
    bun: selectedBun,
    bunFillings: selectedBunFillings,
    totalPrice,
  } = useSelector((state) => state.burgerConstructorSlice);

  const dispatch = useDispatch();

  const [, /*{ draggedItemType, canDrop, isOver: isDraggingItemOver }*/ dropTargetRef] =
    useDrop({
      accept: DndItemTypes.Ingredient,
      drop(item) {
        const { ingredient } = item;
        console.log('dragged', ingredient);
        if (ingredient.type === 'bun') {
          dispatch(setBun(ingredient));
        } else {
          dispatch(appendBunFilling(ingredient));
          ingredients = [...ingredients, ingredient];
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

  function isOrderButtonDisabled() {
    return !selectedBun || !selectedBunFillings || selectedBunFillings.length <= 0;
  }

  function hasFillings() {
    return selectedBunFillings && selectedBunFillings.length > 0;
  }

  async function handleOrderButtonClick() {
    if (isOrderButtonDisabled()) {
      console.log('No data for order');
      return;
    }

    const response = await createOrderMutation([
      selectedBun._id,
      ...selectedBunFillings.map((filling) => filling._id),
      selectedBun._id,
    ]);

    if (response.data) {
      setOrderNumber(response.data?.order?.number);
      setIsOrderCardOpen(true);
    } else if (response.error) {
      console.log('Order creation error:', response.error); // Log the whole object
      console.log(`Error details: ${JSON.stringify(response.error)}`);
      setIsErrorMessageOpen(true);
    }
  }

  function removeIngredient(ingredient) {
    console.log('removing: ', ingredient);
    dispatch(removeBunFilling(ingredient));
  }

  function handleCloseModal() {
    dispatch(clearAll());
    setIsOrderCardOpen(false);
  }

  function handleCloseErrorMessage() {
    setIsErrorMessageOpen(false);
  }

  function handleItemMove(fromIndex, toIndex) {
    console.log(`Moving ${fromIndex} to ${toIndex}`);
    dispatch(moveBunFilling({ fromIndex, toIndex }));
  }

  const WithSwingConstructorElement = withSwing(
    ConstructorElement,
    DndItemTypes.ConstructorItem,
    handleItemMove
  );

  return (
    <section ref={dropTargetRef} className={styles.burger_constructor}>
      <header className={`${styles.bun_block} pl-4 pr-2`}>
        {selectedBun ? (
          <ConstructorElement
            className={styles.bun}
            type="top"
            text={`${selectedBun?.name} (верх)`}
            price={selectedBun?.price}
            thumbnail={selectedBun?.image}
            isLocked={true}
          />
        ) : (
          <div
            className={`${styles.emptyItem} ${styles.empty_bun} ${styles.empty_top_bun}`}
          >
            <div className="text text_type_main-small">Выберите булки</div>
          </div>
        )}
      </header>
      <ul className={`${styles.ingredients_list} pl-1 pr-8 custom-scroll`}>
        {
          // Вставляем заглушку "пустой ингредиент" во внутрь списка, чтобы не повторять его отступы
          !hasFillings() && (
            <li className={`${styles.ingredient_item} mt-2 mb-2 ml-7 mr-0`}>
              <div className={`${styles.emptyItem} text text_type_main-small`}>
                Выберите начинку
              </div>
            </li>
          )
        }
        {selectedBunFillings.map((ingredient, index) => (
          <li
            key={ingredient.key}
            className={`${styles.ingredient_item} mt-2 mb-2 pr-1`}
          >
            <DragIcon type="primary" />
            <WithSwingConstructorElement
              itemIndex={index}
              text={ingredient.name}
              type={ingredient.type}
              price={ingredient.price}
              thumbnail={ingredient.image}
              isLocked={false}
              isDraggable={true}
              handleClose={() => removeIngredient(ingredient)}
            />
          </li>
        ))}
      </ul>
      <footer className={`${styles.bun_block} pl-4 pr-2`}>
        {selectedBun ? (
          <ConstructorElement
            className={styles.bun}
            type="bottom"
            text={`${selectedBun?.name} (низ)`}
            price={selectedBun?.price}
            thumbnail={selectedBun?.image}
            isLocked={true}
          />
        ) : (
          <div
            className={`${styles.emptyItem} ${styles.empty_bun} ${styles.empty_bottom_bun}`}
          >
            <div className="text text_type_main-small">Выберите булки</div>
          </div>
        )}
      </footer>
      <section className={`${styles.order} mt-8 mr-10`}>
        <div className={styles.order_price}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          type="primary"
          size="large"
          htmlType="button"
          disabled={isOrderButtonDisabled()}
          onClick={handleOrderButtonClick}
        >
          Оформить заказ
        </Button>
      </section>
      {isOrderCardOpen && (
        <Modal closeModal={handleCloseModal}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
      {isErrorMessageOpen && (
        <Modal closeModal={handleCloseErrorMessage}>
          <h2 className={`${styles.error_message} text text_type_main-large`}>
            Произошла ошибка отправки данных.
          </h2>
        </Modal>
      )}
    </section>
  );
};
