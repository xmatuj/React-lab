import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchOrders } from '../store/slices/ordersSlice';

const OrderConfirmationPage = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.orders);
    const order = orders.find(o => o.id === parseInt(orderId));

    useEffect(() => {
        if (!order) {
            dispatch(fetchOrders());
        }
    }, [dispatch, order]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
        }).format(price);
    };

    if (!order) {
        return <div className="loading">Загрузка информации о заказе...</div>;
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
                    {order.items.map(item => (
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