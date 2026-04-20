import React, { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useLoginMutation } from '../store/api/authApi';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    
    const [login, { isLoading, error: apiError }] = useLoginMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const from = location.state?.from?.pathname || '/goods';

    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        
        if (!username.trim() || !password.trim()) {
            setLocalError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const result = await login({ 
                username: username.trim(), 
                password: password.trim() 
            }).unwrap();
            
            if (result.success) {
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
            setLocalError(err.data?.error || 'Ошибка авторизации');
        }
    };

    const displayError = localError || (apiError?.data?.error);

    return (
        <div className="container">
            <div className="login-container">
                <h2>Вход в личный кабинет</h2>
                
                {displayError && <div className="error-message">{displayError}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
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
                            disabled={isLoading}
                            placeholder="Введите пароль"
                            autoComplete="current-password"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                
                <p style={{ marginTop: '20px', textAlign: 'center', color: '#888' }}>
                    Тестовые данные:<br/>
                    user / password<br/>
                    admin / admin123
                </p>
                
                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                    Нет аккаунта?{' '}
                    <button 
                        onClick={() => navigate('/register')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ff5722',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Зарегистрироваться
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;