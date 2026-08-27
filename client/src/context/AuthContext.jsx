import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUserStr = localStorage.getItem('labour_platform_user');
    try {
      return storedUserStr ? JSON.parse(storedUserStr) : null;
    } catch (e) {
      return null;
    }
  });
  const [roleProfile, setRoleProfile] = useState(user);
  const [token, setToken] = useState(() => localStorage.getItem('labour_platform_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('labour_platform_token');
      const storedUserStr = localStorage.getItem('labour_platform_user');
      let storedUser = null;
      try {
        storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
      } catch (e) {}

      if (storedToken && storedUser) {
        setUser(storedUser);
        setRoleProfile(storedUser);
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            setRoleProfile(res.profile || res.user);
          }
        } catch (err) {
          console.warn('Auto-login session sync notice:', err.message);
        }
      } else if (!storedToken) {
        setUser(null);
        setRoleProfile(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { identifier, password });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        setRoleProfile(res.profile || res.user);
        localStorage.setItem('labour_platform_token', res.token);
        localStorage.setItem('labour_platform_user', JSON.stringify(res.user));

        // Fetch complete profile with role-specific details in background
        try {
          const profileRes = await api.get('/auth/me');
          if (profileRes.success) {
            setRoleProfile(profileRes.profile);
          }
        } catch (e) {
          console.warn('Profile fetch warning:', e.message);
        }

        return res;
      }
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        setRoleProfile(res.profile || res.user);
        localStorage.setItem('labour_platform_token', res.token);
        localStorage.setItem('labour_platform_user', JSON.stringify(res.user));
        return res;
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    setRoleProfile(null);
    localStorage.removeItem('labour_platform_token');
    localStorage.removeItem('labour_platform_user');
  };

  // Request OTP for password reset
  const requestOTP = async (identifier) => {
    return await api.post('/auth/forgot-password', { identifier });
  };

  // Verify OTP
  const verifyOTP = async (identifier, otp) => {
    return await api.post('/auth/verify-otp', { identifier, otp });
  };

  // Reset Password
  const resetPassword = async (data) => {
    return await api.post('/auth/reset-password', data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        roleProfile,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        requestOTP,
        verifyOTP,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
