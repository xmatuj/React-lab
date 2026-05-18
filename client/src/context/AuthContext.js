import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction, restoreAuth } from '../store/slices/authSlice';
import { setUserCart, clearCart } from '../store/slices/cartSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token && user) {
      dispatch(restoreAuth({ user, token }));
      dispatch(setUserCart({ userId: user.id, cart: null }));
    }
  }, [dispatch]);

  const logout = () => {
    dispatch(clearCart());
    dispatch(logoutAction());
  };

  const value = {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};