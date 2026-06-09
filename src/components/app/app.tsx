import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import IngredientDetails from '@/components/burger-ingredients/ingredient-details/ingredient-details';
import OrderFullInfo from '@/components/order/order-full-info/order-full-info';
import { ForgotPasswordPage } from '@/pages/auth-pages/forgot-password/forgot-password';
import { LoginPage } from '@/pages/auth-pages/login/login';
import { RegisterPage } from '@/pages/auth-pages/register/register';
import { ResetPasswordPage } from '@/pages/auth-pages/reset-password/reset-password';
import { FeedPage } from '@/pages/feed/feed';
import { Home } from '@/pages/home/home';
import { IngredientDetailsPage } from '@/pages/ingredient-details/ingredient-details-page';
import { NotFoundPage } from '@/pages/not-found/not-found.tsx';
import { OrderFullInfoPage } from '@/pages/order-full-info/order-full-info-page';
import { ProfileOrders } from '@/pages/profile/profile-orders/profile-orders.tsx';
import { ProfilePage } from '@/pages/profile/profile-page.tsx';
import { Profile } from '@/pages/profile/profile/profile.tsx';
import { useGetIngredientsQuery } from '@/services/api';
import { AppHeader } from '@components/app-header/app-header';
import { ProtectedRoute } from '@components/protected-route/protected-route.tsx';
import { useAppDispatch } from '@hooks/hooks';
import { checkUserAuth } from '@services/user/actions';

import Modal from '../modal/modal';

import type { JSX } from 'react';

export const App = (): JSX.Element => {
  // Сразу стартуем загрузку данных ингредиентов
  useGetIngredientsQuery();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkUserAuth());
    console.log('Called checkUserAuth');
  }, [dispatch]);

  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const navigate = useNavigate();

  function handleCloseModal(): void {
    navigate(-1);
  }

  return (
    <>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<ProtectedRoute onlyUnAuth component={<LoginPage />} />}
        />
        <Route
          path="/register"
          element={<ProtectedRoute onlyUnAuth component={<RegisterPage />} />}
        />
        <Route
          path="/forgot-password"
          element={<ProtectedRoute onlyUnAuth component={<ForgotPasswordPage />} />}
        />
        <Route
          path="/reset-password"
          element={<ProtectedRoute onlyUnAuth component={<ResetPasswordPage />} />}
        />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:id" element={<OrderFullInfoPage />} />

        <Route path="/profile" element={<ProtectedRoute component={<ProfilePage />} />}>
          <Route index element={<Profile />} />
          <Route path="orders" element={<ProfileOrders />} />
        </Route>
        <Route path="/profile/orders/:id" element={<OrderFullInfoPage />} />

        <Route path="/ingredients/:ingredientId" element={<IngredientDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:ingredientId"
            element={
              <Modal header="Детали ингредиента" closeModal={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:id"
            element={
              <Modal header="Информация о заказе" closeModal={handleCloseModal}>
                <OrderFullInfo />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:id"
            element={
              <Modal header="Информация о заказе" closeModal={handleCloseModal}>
                <OrderFullInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
