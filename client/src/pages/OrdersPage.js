import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../store/slices/ordersSlice';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const formatPrice = (price) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(price);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="loading" aria-live="polite">Загрузка заказов...</div>;
  if (error) return <div className="error" role="alert">{error}</div>;

  return (
    <div className="container">
      <h1>Мои заказы</h1>
      
      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>У вас пока нет заказов</p>
          <button className="btn primary-btn" onClick={() => navigate('/goods')} aria-label="Перейти к покупкам">Перейти к покупкам</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header"><div><h2 style={{ fontSize: '1.2rem' }}>Заказ #{order.id}</h2><p className="order-date">{formatDate(order.createdAt)}</p></div></div>
              <div className="order-items">
                {order.items.map(item => <div key={item.id} className="order-item"><span>{item.name} x {item.quantity}</span><span>{formatPrice(item.price * item.quantity)}</span></div>)}
              </div>
              <div className="order-footer"><div className="order-total"><strong>Итого: {formatPrice(order.totalAmount)}</strong></div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;