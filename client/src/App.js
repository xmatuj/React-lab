import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Notifications from './components/Notifications';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoodsPage from './pages/GoodsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import SkipToContent from './components/SkipToContent';
import AccessibilityPanel from './components/AccessibilityPanel';
import { setUserCart } from './store/slices/cartSlice';

const ThemeApplier = () => {
  const theme = useSelector(state => state.ui.theme);
  const fontSize = useSelector(state => state.ui.fontSize);
  
  useEffect(() => {
    document.body.className = theme;
    document.documentElement.lang = 'ru';
    document.documentElement.style.setProperty('--font-size-base', `${fontSize}%`);
  }, [theme, fontSize]);
  
  return null;
};

const CartInitializer = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { userId } = useSelector(state => state.cart);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (userId !== user.id) {
        const savedCart = localStorage.getItem(`cart_${user.id}`);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          dispatch(setUserCart({ userId: user.id, cart: parsed }));
        } else {
          dispatch(setUserCart({ userId: user.id, cart: { items: [], totalAmount: 0, totalItems: 0 } }));
        }
      }
    }
  }, [isAuthenticated, user, userId, dispatch]);

  return null;
};

function AppContent() {
  return (
    <>
      <ThemeApplier />
      <CartInitializer />
      <SkipToContent />
      <AccessibilityPanel />
      <Notifications />
      <Header />
      <main id="main-content" tabIndex="-1" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/goods" element={<ProtectedRoute><GoodsPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Provider>
  );
}

export default App;