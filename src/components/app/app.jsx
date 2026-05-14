import { Routes, Route } from 'react-router-dom';

import { ForgotPasswordPage } from '@/pages/auth-pages/forgot-password/forgot-password';
import { LoginPage } from '@/pages/auth-pages/login/login';
import { NotFoundPage } from '@/pages/auth-pages/not-found/not-found';
import { RegisterPage } from '@/pages/auth-pages/register/register';
import { ResetPasswordPage } from '@/pages/auth-pages/reset-password/reset-password';
import { Home } from '@/pages/home/home';
import { IngredientDetailsPage } from '@/pages/ingredient-details/ingredient-details-page';
import { AppHeader } from '@components/app-header/app-header';

import { useGetIngredientsQuery } from '../../services/burgerApi';

export const App = () => {
  // Сразу стартуем загрузку данных
  useGetIngredientsQuery();

  return (
    <>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/ingredients/:ingredientId" element={<IngredientDetailsPage />} />
        {/* <Route
          path="/login"
          element={<ProtectedRoute onlyUnAuth component={<Login />} />}
        />
        <Route path="/profile" element={<ProtectedRoute component={<Profile />} />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};
