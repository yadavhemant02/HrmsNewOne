// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';

// Get initial state from localStorage
const loadAuthState = () => {
  try {
    return {
      token: localStorage.getItem('token') || null,
      user: {
        name: localStorage.getItem('name') || null,
        email: localStorage.getItem('email') || null,
        empCode: localStorage.getItem('empCode') || null,
        empNumber: localStorage.getItem('empNumber') || null,
        organizationName: localStorage.getItem('organizationName') || null,
        organizationCode: localStorage.getItem('organizationCode') || null,
        manager: localStorage.getItem('manager') || null,
        role: localStorage.getItem('role') || null,
      },
      isAuthenticated: !!localStorage.getItem('token'),
      isLoading: false,
      error: null,
      registrationData: null,
      tempAuthData: null, // Used during registration and OTP flow
    };
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registrationData: null,
      tempAuthData: null,
    };
  }
};

const initialState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('name', user.name || '');
        localStorage.setItem('email', user.email || '');
        localStorage.setItem('empCode', user.empCode || '');
        localStorage.setItem('empNumber', user.empNumber || '');
        localStorage.setItem('organizationName', user.organizationName || '');
        localStorage.setItem('organizationCode', user.organizationCode || '');
        localStorage.setItem('manager', user.manager || '');
        localStorage.setItem('role', user.role || '');
      }
    },
    setTempAuthData: (state, action) => {
      state.tempAuthData = action.payload;
      
      // Save temporary credentials to localStorage during registration/login flow
      if (action.payload.email) {
        localStorage.setItem('email', action.payload.email);
      }
      if (action.payload.password) {
        localStorage.setItem('password', action.payload.password);
      }
      if (action.payload.organizationCode) {
        localStorage.setItem('organizationCode', action.payload.organizationCode);
      }
    },
    setRegistrationData: (state, action) => {
      state.registrationData = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      // Clear state
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.tempAuthData = null;
      
      // Clear localStorage
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    // Handle registration states
    builder.addMatcher(
      authApi.endpoints.registerCompany.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.registerCompany.matchFulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        state.registrationData = payload;
        // Save organizationCode to localStorage after registration
        if (payload.organizationCode) {
          localStorage.setItem('organizationCode', payload.organizationCode);
        }
      }
    );
    builder.addMatcher(
      authApi.endpoints.registerCompany.matchRejected,
      (state, { payload }) => {
        state.isLoading = false;
        state.error = payload || 'Registration failed';
      }
    );
    
    // Handle login states
    builder.addMatcher(
      authApi.endpoints.login.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        // For OTP flow, we don't set the token yet
        state.tempAuthData = {
          ...state.tempAuthData,
          loginResponse: payload
        };
      }
    );
    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (state, { payload }) => {
        state.isLoading = false;
        state.error = payload || 'Login failed';
      }
    );
    
    // Handle OTP verification states
    builder.addMatcher(
      authApi.endpoints.verifyOtp.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.verifyOtp.matchFulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = payload.token;
        state.user = {
          name: payload.name,
          empCode: payload.empCode,
          empNumber: payload.empNumber,
          organizationName: payload.organizationName,
          organizationCode: payload.organizationCode,
          manager: payload.manager,
          role: payload.role,
          email: state.tempAuthData?.email || localStorage.getItem('email'),
        };
        
        // Save auth data to localStorage
        localStorage.setItem('token', payload.token);
        localStorage.setItem('name', payload.name || '');
        localStorage.setItem('empCode', payload.empCode || '');
        localStorage.setItem('empNumber', payload.empNumber || '');
        localStorage.setItem('organizationName', payload.organizationName || '');
        localStorage.setItem('organizationCode', payload.organizationCode || '');
        localStorage.setItem('manager', payload.manager || '');
        localStorage.setItem('role', payload.role || '');
        
        // Clear temp data
        localStorage.removeItem('password');
        state.tempAuthData = null;
      }
    );
    builder.addMatcher(
      authApi.endpoints.verifyOtp.matchRejected,
      (state, { payload }) => {
        state.isLoading = false;
        state.error = payload || 'OTP verification failed';
      }
    );
  },
});

export const { setCredentials, setTempAuthData, setRegistrationData, clearError, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectRegistrationData = (state) => state.auth.registrationData;
export const selectTempAuthData = (state) => state.auth.tempAuthData;