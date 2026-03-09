import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated, user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
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
                        <NavLink 
                            to="/login" 
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            Вход
                        </NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;