import React from 'react';
import { useGetOrdersQuery } from '../store/api/ordersApi';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetOrdersQuery();
    
    // Убеждаемся, что orders всегда массив
    const orders = Array.isArray(data?.orders) ? data.orders : [];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return <div className="loading">Загрузка заказов...</div>;
    }

    if (error) {
        console.error('Orders error:', error);
        return (
            <div className="error">
                {error.data?.error || error.error || 'Ошибка загрузки заказов'}
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Мои заказы</h1>
            
            {orders.length === 0 ? (
                <div className="empty-orders">
                    <p>У вас пока нет заказов</p>
                    <button 
                        className="btn primary-btn"
                        onClick={() => navigate('/goods')}
                    >
                        Перейти к покупкам
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <h3>Заказ #{order.id}</h3>
                                    <p className="order-date">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>
                            
                            <div className="order-items">
                                {order.items && order.items.map(item => (
                                    <div key={item.id} className="order-item">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="order-footer">
                                <div className="order-total">
                                    <strong>Итого: {formatPrice(order.totalAmount)}</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;