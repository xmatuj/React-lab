import React, { useState, useEffect } from 'react';
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
    const [registered, setRegistered] = useState(false);

    // Хуки должны быть вызваны до условных возвратов
    useEffect(() => {
        if (isAuthenticated && registered) {
            navigate('/goods');
        }
    }, [isAuthenticated, registered, navigate]);

    // Если уже авторизован, редирект
    if (isAuthenticated && !registered) {
        navigate('/');
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');

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

        setRegistered(true);
        
        // Регистрация
        dispatch(register({
            username: formData.username,
            password: formData.password,
            email: formData.email
        }));
        
        // Ждем немного и пробуем войти
        setTimeout(() => {
            dispatch(login({
                username: formData.username,
                password: formData.password
            }));
        }, 500);
    };

    const errorMessage = typeof error === 'string' ? error : (error?.message || null);

    return (
        <div className="container">
            <div className="auth-container">
                <h2>Регистрация</h2>
                
                {(validationError || errorMessage) && (
                    <div className="error-message">
                        {validationError || errorMessage}
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
            </div>
        </div>
    );
};

export default RegisterPage;