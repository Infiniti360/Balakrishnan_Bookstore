import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/api';
import { isAuthenticated, isTokenExpired } from '../utils/auth';

// Create Auth context
const AuthContext = createContext(null);

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated() && !isTokenExpired()) {
        setUser({ authenticated: true });
      } else {
        // Clear token if expired
        if (isTokenExpired()) {
          localStorage.removeItem('token');
        }
        setUser(null);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const { token } = await authService.login(email, password);
      localStorage.setItem('token', token);
      setUser({ authenticated: true });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Login failed'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      await authService.register(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Registration failed'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: 'Logout failed'
      };
    }
  };

  // Auth context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 