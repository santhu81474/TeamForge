import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const persistUser = (data) => {
    if (!data) {
      setUser(null);
      localStorage.removeItem('user');
      return;
    }
    const normalized = { ...data, id: data._id || data.id };
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
  };

  // Authenticate across session via server verification
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            persistUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem('user');
          }
        }

        try {
          const { data } = await getProfile();
          persistUser(data);
        } catch (error) {
          console.error("Token invalid or expired", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    persistUser(data);
  };

  const signup = async (name, email, password, skillsArray, githubUrl, linkedinUrl) => {
    const { data } = await registerUser({ name, email, password, skills: skillsArray, githubUrl, linkedinUrl });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    persistUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
