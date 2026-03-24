import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Mock validating token / getting user info
      // In a real app: api.get('/auth/me')
      setUser({ id: 1, name: 'John Doe', email: 'john@example.com' });
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      // Mock API call: 
      // const response = await api.post('/auth/login', { email, password });
      const mockToken = 'mock-jwt-token-12345';
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser({ id: 1, name: 'John Doe', email });
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Mock API call
      // const response = await api.post('/auth/signup', { name, email, password });
      const mockToken = 'mock-jwt-token-12345';
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser({ id: 1, name, email });
      return true;
    } catch (error) {
      console.error("Signup failed", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
