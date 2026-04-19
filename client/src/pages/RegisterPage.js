import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, login } from '../store/actions/authActions';

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
    const [isRegistering, setIsRegistering] = useState(false);

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
        setIsRegistering(true);

        // Валидация
        if (!formData.username || !formData.email || !formData.password) {
            setValidationError('Все поля обязательны для заполнения');
            setIsRegistering(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setValidationError('Пароли не совпадают');
            setIsRegistering(false);
            return;
        }

        if (formData.password.length < 6) {
            setValidationError('Пароль должен содержать минимум 6 символов');
            setIsRegistering(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setValidationError('Введите корректный email');
            setIsRegistering(false);
            return;
        }

        try {
            // Сначала регистрируем пользователя
            const registerResult = await dispatch(register(
                formData.username,
                formData.password,
                formData.email
            ));

            if (registerResult.success) {
                // Если регистрация успешна, автоматически входим
                const loginResult = await dispatch(login(
                    formData.username,
                    formData.password
                ));

                if (loginResult.success) {
                    // Перенаправляем на страницу товаров
                    navigate('/goods');
                } else {
                    // Если вход не удался, перенаправляем на страницу входа
                    setValidationError('Регистрация успешна, но не удалось выполнить вход. Пожалуйста, войдите вручную.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            } else {
                setValidationError(registerResult.error || 'Ошибка регистрации');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setValidationError('Ошибка соединения с сервером');
        } finally {
            setIsRegistering(false);
        }
    };

    const isLoading = loading || isRegistering;

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