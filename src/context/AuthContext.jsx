import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authenticate across session via server verification
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await getProfile();
          setUser({ ...data, id: data._id }); // Map Mongo _id universally
        } catch (error) {
          console.error("Token invalid or expired", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem('token', data.token);
    setUser({ ...data, id: data._id });
  };

  const signup = async (name, email, password, skillsArray) => {
    const { data } = await registerUser({ name, email, password, skills: skillsArray });
    localStorage.setItem('token', data.token);
    setUser({ ...data, id: data._id });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
