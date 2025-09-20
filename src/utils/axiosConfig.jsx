// src/utils/axiosConfig.js
import axios from 'axios';
import { base_emp, base_hr, base_identity } from '../http/services';

// Base URLs
export const BASE_URLS = {
  identity: base_identity,
  hr: base_hr,
  employee: base_emp
};

// Create axios instances for different services
export const identityApi = axios.create({
  baseURL: BASE_URLS.identity,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

export const hrApi = axios.create({
  baseURL: BASE_URLS.hr,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

export const employeeApi = axios.create({
  baseURL: BASE_URLS.employee,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

// Request interceptor to attach auth token
const setupInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 unauthorized errors
      if (error.response && error.response.status === 401) {
        // Clear localStorage and redirect to login
        localStorage.clear();
        window.location.href = '/login-page';
      }
      return Promise.reject(error);
    }
  );
};

// Apply interceptors to all API instances
setupInterceptors(identityApi);
setupInterceptors(hrApi);
setupInterceptors(employeeApi);

export default { identityApi, hrApi, employeeApi };