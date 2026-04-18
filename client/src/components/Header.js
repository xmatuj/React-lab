import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const cartItems = useSelector(state => state.cart.totalItems);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    🎵 MusicShop
                </Link>
                
                <nav className="nav">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => isActive ? 'active' : ''}
                        end
                    >
                        Главная
                    </NavLink>
                    
                    <NavLink 
                        to="/goods" 
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Товары
                    </NavLink>
                    
                    {isAuthenticated && (
                        <NavLink 
                            to="/orders" 
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            Мои заказы
                        </NavLink>
                    )}
                    
                    <NavLink 
                        to="/cart" 
                        className={({ isActive }) => isActive ? 'active cart-link' : 'cart-link'}
                    >
                        Корзина
                        {cartItems > 0 && (
                            <span className="cart-badge">{cartItems}</span>
                        )}
                    </NavLink>
                    
                    {isAuthenticated ? (
                        <>
                            <span style={{ color: '#ff5722', padding: '8px 16px' }}>
                                Привет, {user?.name || user?.username}!
                            </span>
                            <button 
                                onClick={handleLogout}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: '8px 16px'
                                }}
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink 
                                to="/login" 
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                Вход
                            </NavLink>
                            <NavLink 
                                to="/register" 
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                                Регистрация
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;