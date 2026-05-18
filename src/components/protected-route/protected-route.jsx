import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '@services/user/userSlice';

export const ProtectedRoute = ({ onlyUnAuth = false, component }) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return null;
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
