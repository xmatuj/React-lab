import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [loginTriggered, setLoginTriggered] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);

    const from = location.state?.from?.pathname || '/goods';

    useEffect(() => {
        if (isAuthenticated && loginTriggered) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, loginTriggered, navigate, from]);

    if (isAuthenticated && !loginTriggered) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError('');
        setLoginTriggered(true);
        
        if (!username.trim() || !password.trim()) {
            setLocalError('Пожалуйста, заполните все поля');
            setLoginTriggered(false);
            return;
        }

        dispatch(login({ 
            username: username.trim(), 
            password: password.trim()
        }));
    };

    const errorMessage = typeof error === 'string' ? error : (error?.message || null);
    const displayError = localError || errorMessage;

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
                        />
                    </div>
                    
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
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