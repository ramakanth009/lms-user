// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated on mount and set up API interceptors
    const checkAuth = () => {
      try {
        const auth = AuthService.getCurrentUser();
        setIsAuthenticated(auth.isAuthenticated);
        
        // Set up axios interceptors for token refresh
        AuthService.setupAxiosInterceptors();
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Create logout handler
  const logout = async () => {
    try {
      await AuthService.logout();
      setIsAuthenticated(false);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error in context:', error);
      // Even on error, we still want to clear the auth state
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      loading, 
      user, 
      setUser,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;