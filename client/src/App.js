import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GoodsPage from './pages/GoodsPage';

const API_URL = 'http://localhost:3001/api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Проверка авторизации при загрузке приложения
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    // Проверяем токен на сервере
                    const response = await axios.get(`${API_URL}/check-auth`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.data.authenticated) {
                        setIsAuthenticated(true);
                        setUser(JSON.parse(savedUser));
                    } else {
                        // Токен недействителен
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    if (loading) {
        return <div className="loading">Загрузка приложения...</div>;
    }

    return (
        <BrowserRouter>
            <Header 
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
            />
            
            <main style={{ minHeight: 'calc(100vh - 200px)' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route 
                        path="/login" 
                        element={
                            <LoginPage 
                                onLogin={handleLogin}
                                isAuthenticated={isAuthenticated}
                            />
                        } 
                    />
                    <Route 
                        path="/goods" 
                        element={
                            <GoodsPage isAuthenticated={isAuthenticated} />
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            
            <Footer />
        </BrowserRouter>
    );
}

export default App;