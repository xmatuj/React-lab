import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const LoginPage = ({ onLogin, isAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    // Если пользователь уже авторизован, перенаправляем на главную
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!username.trim() || !password.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/login`, {
                username: username.trim(),
                password: password.trim()
            });

            if (response.data.success) {
                // Сохраняем токен и данные пользователя
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Вызываем функцию onLogin из родительского компонента
                onLogin(response.data.user);
                
                // Перенаправляем на страницу товаров
                navigate('/goods');
            } else {
                setError(response.data.error || 'Ошибка авторизации');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(
                err.response?.data?.error || 
                'Ошибка соединения с сервером'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="login-container">
                <h2>Вход в личный кабинет</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            placeholder="Введите имя пользователя"
                            autoComplete="username"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            placeholder="Введите пароль"
                            autoComplete="current-password"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                
                <p style={{ marginTop: '20px', textAlign: 'center', color: '#888' }}>
                    Тестовые данные: любое имя и пароль (более 3 символов)
                </p>
            </div>
        </div>
    );
};

export default LoginPage;