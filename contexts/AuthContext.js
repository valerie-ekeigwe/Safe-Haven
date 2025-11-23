import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth as authAPI } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setUserData(parsedUser);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Sign up with email and password
  const signup = async (email, password, name, neighborhood = 'Downtown') => {
    try {
      const result = await authAPI.register(email, password, name, neighborhood);
      
      setUser(result.user);
      setUserData(result.user);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
      
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      const result = await authAPI.login(email, password);
      
      setUser(result.user);
      setUserData(result.user);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      authAPI.logout();
      setUser(null);
      setUserData(null);
      
      // Clear localStorage
      localStorage.removeItem('user');
      
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};