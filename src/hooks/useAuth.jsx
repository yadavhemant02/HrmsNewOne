// src/hooks/useAuth.js
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  logout,
  clearError
} from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login-page');
  }, [dispatch, navigate]);
  
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  const redirectIfAuthenticated = useCallback((path = '/dashboard') => {
    if (isAuthenticated) {
      // Check user role for proper redirection
      const userRole = user?.role?.toUpperCase();
      if (userRole === 'COMPANY' || userRole === 'HR') {
        navigate('/dashboard-hr');
      } else {
        navigate('/dashboard-emp');
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  const redirectIfUnauthenticated = useCallback((path = '/login-page') => {
    if (!isAuthenticated) {
      navigate(path);
    }
  }, [isAuthenticated, navigate]);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout: handleLogout,
    clearError: handleClearError,
    redirectIfAuthenticated,
    redirectIfUnauthenticated
  };
};

export default useAuth;