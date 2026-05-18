import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cartItems = useSelector(state => state.cart.totalItems);
  const theme = useSelector(state => state.ui.theme);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="header" role="banner">
      <div className="container header-content">
        <Link to="/" className="logo" aria-label="MusicShop - главная страница">
          🎵 MusicShop
        </Link>
        
        <nav className="nav" role="navigation" aria-label="Основное меню">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
            Главная
          </NavLink>
          
          {isAuthenticated && (
            <>
              <NavLink to="/goods" className={({ isActive }) => isActive ? 'active' : ''}>
                Товары
              </NavLink>
              <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
                Мои заказы
              </NavLink>
              <NavLink to="/cart" className={({ isActive }) => isActive ? 'active cart-link' : 'cart-link'} aria-label={`Корзина, ${cartItems} товаров`}>
                Корзина
                {cartItems > 0 && <span className="cart-badge" aria-label={`${cartItems} товаров`}>{cartItems}</span>}
              </NavLink>
            </>
          )}
          
          {isAuthenticated ? (
            <>
              <span style={{ color: '#ff5722', padding: '8px 16px' }} aria-label={`Привет, ${user?.name || user?.username}`}>
                Привет, {user?.name || user?.username}!
              </span>
              <button onClick={handleLogout} aria-label="Выйти из аккаунта" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '8px 16px' }}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
                Вход
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>
                Регистрация
              </NavLink>
            </>
          )}
          
          <button
            onClick={handleToggleTheme}
            aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px 12px', borderRadius: '50%', marginLeft: '10px' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;