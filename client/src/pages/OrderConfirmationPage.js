import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../store/api/ordersApi';

const OrderConfirmationPage = () => {
    const { orderId } = useParams();
    const { data, isLoading } = useGetOrdersQuery();
    
    // Безопасное извлечение заказа
    const orders = Array.isArray(data?.orders) ? data.orders : [];
    const order = orders.find(o => o.id === parseInt(orderId));

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
        }).format(price);
    };

    if (isLoading) {
        return <div className="loading">Загрузка информации о заказе...</div>;
    }

    if (!order) {
        return (
            <div className="container">
                <div className="error">
                    <p>Заказ не найден</p>
                    <Link to="/orders" className="btn primary-btn">
                        Перейти к заказам
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="order-confirmation">
                <div className="success-icon">✅</div>
                <h1>Заказ успешно оформлен!</h1>
                <p>Номер вашего заказа: <strong>#{order.id}</strong></p>
                <p>Спасибо за покупку! Мы отправили подтверждение на ваш email.</p>
                
                <div className="order-details">
                    <h2>Детали заказа</h2>
                    {order.items && order.items.map(item => (
                        <div key={item.id} className="order-item">
                            <span>{item.name} x {item.quantity}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                    ))}
                    
                    <div className="order-total">
                        <strong>Итого: {formatPrice(order.totalAmount)}</strong>
                    </div>
                </div>
                
                <div className="action-buttons">
                    <Link to="/orders" className="btn primary-btn">
                        Мои заказы
                    </Link>
                    <Link to="/goods" className="btn secondary-btn">
                        Продолжить покупки
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;