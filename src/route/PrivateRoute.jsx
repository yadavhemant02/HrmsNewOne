import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '../context/AuthContext';
import ShapesLoader from '../constent/ShapesLoader';

const ProtectedRoute = ({ children }) => {
  const { user, loading: contextLoading } = useContext(AuthContext); // Context-based authentication
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Redux-based authentication
  const loading = useSelector((state) => state.auth.loading) || contextLoading; // Combined loading state

  // Show loading spinner if either context or Redux is still loading
  if (loading) return <ShapesLoader size="medium" />;

  // Redirect to /login if the AuthContext user is not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect to /HR-Monitor if Redux-based authentication fails
  if (!isAuthenticated) {
    return <Navigate to="/HR-Monitor" />;
  }

  // Render children if both Context and Redux checks are satisfied
  return children;
};

export default ProtectedRoute;
