import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents UI flashing while checking session

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.data.user);
      } catch (error) {
        // 401 Unauthorized simply means they aren't logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.data.user);
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    setUser(res.data.data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
