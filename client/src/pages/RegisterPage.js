import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation, useLoginMutation } from '../store/api/authApi';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [register, { isLoading: isRegistering }] = useRegisterMutation();
    const [login, { isLoading: isLoggingIn }] = useLoginMutation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [validationError, setValidationError] = useState('');

    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');

        // Валидация
        if (!formData.username || !formData.email || !formData.password) {
            setValidationError('Все поля обязательны для заполнения');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setValidationError('Пароли не совпадают');
            return;
        }

        if (formData.password.length < 6) {
            setValidationError('Пароль должен содержать минимум 6 символов');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setValidationError('Введите корректный email');
            return;
        }

        try {
            await register({
                username: formData.username,
                password: formData.password,
                email: formData.email
            }).unwrap();

            await login({
                username: formData.username,
                password: formData.password
            }).unwrap();

            navigate('/goods');
        } catch (err) {
            setValidationError(err.data?.error || 'Ошибка регистрации');
        }
    };

    const isLoading = isRegistering || isLoggingIn;

    return (
        <div className="container">
            <div className="auth-container">
                <h2>Регистрация</h2>
                
                {validationError && (
                    <div className="error-message">
                        {validationError}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                            placeholder="Введите имя пользователя"
                            autoComplete="username"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                            placeholder="Введите email"
                            autoComplete="email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                            placeholder="Минимум 6 символов"
                            autoComplete="new-password"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Подтверждение пароля</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                            placeholder="Повторите пароль"
                            autoComplete="new-password"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn primary-btn"
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    >
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                
                <p className="auth-link">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
                
                <div style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>
                    <p>После регистрации вы будете автоматически авторизованы</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;