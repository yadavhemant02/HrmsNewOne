// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {base_url} from "../http/services"
// import logo from "../assets/images/l"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (e.g., via token in local storage)
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (loginData) => {
    try {
      const response = await axios.post(`${base_url}/identity-handler/auth/login-employee`, loginData);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser({ token: response.data.token });
        console.log(response.data);
        return response.data;

      }
    } catch (error) {
      console.error(error);
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
