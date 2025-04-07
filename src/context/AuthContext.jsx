import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);
const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const handleSignIn = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, { email, password });
      const { user, token } = response.data;
      localStorage.setItem('authToken', token);
      setToken(token);
      setUser(user);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to sign in');
    }
  };

  const handleSignUp = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, { email, password });
      const { user, token } = response.data;
      localStorage.setItem('authToken', token);
      setToken(token);
      setUser(user);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to sign up');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}