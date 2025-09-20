import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';

// Create a context for managing alerts
const AlertContext = createContext();

// Custom hook to use the alert context
export const useAlert = () => useContext(AlertContext);

// Alert Provider Component
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Function to show alert
  const showAlert = (message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  // Function to close alert
  const closeAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={closeAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeAlert} 
          severity={alert.severity} 
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};