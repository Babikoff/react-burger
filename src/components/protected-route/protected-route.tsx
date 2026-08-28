import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@hooks/hooks';
import { selectIsAuthChecked, selectUser } from '@services/user/userSlice';

interface IProtectedRouteProps {
  component: React.ReactNode;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component,
}: IProtectedRouteProps): React.ReactNode => {
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <></>;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return component;
};
