import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCheckAuthQuery } from '../store/api/authApi';
import { logout as logoutAction } from '../store/slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const { isLoading } = useCheckAuthQuery();

    const logout = () => {
        dispatch(logoutAction());
    };

    const value = {
        isAuthenticated: !!auth.user,
        user: auth.user,
        loading: isLoading,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};