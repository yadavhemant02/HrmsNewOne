// src/components/ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';
import { selectIsAuthenticated, selectAuthLoading } from '../redux/slices/authSlice';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const user = useSelector(state => state.auth.user);
  const location = useLocation();

  // Check if user has the required role
  // const hasRequiredRole = () => {
  //   // if(requiredRole==="HR" || requiredRole==="COMPANY"){
  //   //     return true;
  //   // }

  //   if(Array.isArray(requiredRole)){
  //     console.log("bhai")
  //     if (requiredRole.includes(user.role)) {
  //       console.log("nananana",requiredRole)
  //       return true;
  //     }
  //   }

  //   console.log(requiredRole,user)
  //   if (!requiredRole) return true;
  //   if (!user || !user.role) return false;
    
  //   // Handle array of roles or single role
  //   if (Array.isArray(requiredRole)) {
  //     return requiredRole.some(role => user.role.toUpperCase() === role.toUpperCase());
  //   }
    
  //   return user.role.toUpperCase() === requiredRole.toUpperCase();
  // };

  // const hasRequiredRole = () => {
  //   if (!user || !user.role) return false;

  //   console.log("Lllllllll")
  
  //   const userRole = user.role.toUpperCase();
  
  //   if (Array.isArray(requiredRole)) {
  //     console.log("pppppppppppppppppp")
  //     if(requiredRole.includes(user.role)){
  //         return true;
  //     }
  //     // return requiredRole.some(role => userRole === role.toUpperCase());
  //   }
  
  //   return userRole === requiredRole.toUpperCase();
  // };
  

  const hasRequiredRole = () => {
   
    return true;
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login-page" state={{ from: location }} replace />;
  }

  // Redirect to unauthorized page if role doesn't match
  if (hasRequiredRole()===false) {

    console.log("fffffffffffffffffffffffffffffffffffff",hasRequiredRole())
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authenticated and authorized
  return children;
};

export default ProtectedRoute;