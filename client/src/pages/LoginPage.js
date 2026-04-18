import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/actions/authActions';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);

    // Если пользователь уже авторизован перенаправляем на главную
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        
        if (!username.trim() || !password.trim()) {
            setLocalError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const result = await dispatch(login(username.trim(), password.trim()));
            
            if (result.success) {
                navigate('/goods');
            } else {
                setLocalError(result.error || 'Ошибка авторизации');
            }
        } catch (err) {
            console.error('Login error:', err);
            setLocalError('Ошибка соединения с сервером');
        }
    };

    const displayError = localError || error;

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
                    Тестовые данные:<br/>
                    user / password<br/>
                    admin / admin123
                </p>
            </div>
        </div>
    );
};

export default LoginPage;