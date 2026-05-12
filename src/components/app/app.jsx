import { Routes, Route } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { Home } from '@components/home/home';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password';
import { LoginPage } from '@pages/login/login';
import { NotFoundPage } from '@pages/not-found/not-found';
import { RegisterPage } from '@pages/register/register';
import { ResetPasswordPage } from '@pages/reset-password/reset-password';

export const App = () => {
  //   const {
  //     data: ingredients = {},
  //     isLoading = true,
  //     isFetching = true,
  //     isError: hasError = false,
  //   } = useGetIngredientsQuery();

  return (
    <>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
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
