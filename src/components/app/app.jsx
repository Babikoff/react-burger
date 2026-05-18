import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { ForgotPasswordPage } from '@/pages/auth-pages/forgot-password/forgot-password';
import { LoginPage } from '@/pages/auth-pages/login/login';
import { RegisterPage } from '@/pages/auth-pages/register/register';
import { ResetPasswordPage } from '@/pages/auth-pages/reset-password/reset-password';
import { Home } from '@/pages/home/home';
import { IngredientDetailsPage } from '@/pages/ingredient-details/ingredient-details-page';
import { NotFoundPage } from '@/pages/not-found/not-found.jsx';
import { ProfileOrders } from '@/pages/profile/profile-orders/profile-orders.jsx';
import { ProfilePage } from '@/pages/profile/profile-page.jsx';
import { Profile } from '@/pages/profile/profile/profile.jsx';
import { AppHeader } from '@components/app-header/app-header';
import { ProtectedRoute } from '@components/protected-route/protected-route.jsx';
import { checkUserAuth } from '@services/user/actions.js';

import { useGetIngredientsQuery } from '../../services/api';
import IngredientDetails from '../burger-ingredients/ingredient-details/ingredient-details.jsx';
import Modal from '../modal/modal.jsx';

export const App = () => {
  // Сразу стартуем загрузку данных ингредиентов
  useGetIngredientsQuery();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkUserAuth());
    console.log('Called checkUserAuth');
  }, [dispatch]);

  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const navigate = useNavigate();

  function handleCloseModal() {
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

        <Route path="/profile" element={<ProtectedRoute component={<ProfilePage />} />}>
          <Route index element={<Profile />} />
          <Route path="orders" element={<ProfileOrders />} />
        </Route>

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
        </Routes>
      )}
    </>
  );
};
