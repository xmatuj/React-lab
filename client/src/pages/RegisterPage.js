import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, login } from '../store/slices/authSlice';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);
    
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
            // Сначала регистрируем пользователя
            await dispatch(register({
                username: formData.username,
                password: formData.password,
                email: formData.email
            })).unwrap();

            // Если регистрация успешна, автоматически входим
            await dispatch(login({
                username: formData.username,
                password: formData.password
            })).unwrap();

            // Перенаправляем на страницу товаров
            navigate('/goods');
        } catch (err) {
            setValidationError(err || 'Ошибка регистрации');
        }
    };

    return (
        <div className="container">
            <div className="auth-container">
                <h2>Регистрация</h2>
                
                {(error || validationError) && (
                    <div className="error-message">
                        {validationError || error}
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
                            disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
                            required
                            placeholder="Повторите пароль"
                            autoComplete="new-password"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn primary-btn"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
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