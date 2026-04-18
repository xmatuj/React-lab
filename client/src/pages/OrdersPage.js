import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../store/actions/ordersActions';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, loading, error } = useSelector(state => state.orders);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchOrders());
        } else {
            navigate('/login');
        }
    }, [dispatch, isAuthenticated, navigate]);

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

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'В обработке',
            'processing': 'Готовится к отправке',
            'shipped': 'Отправлен',
            'delivered': 'Доставлен',
            'cancelled': 'Отменен'
        };
        return statusMap[status] || status;
    };

    if (loading) {
        return <div className="loading">Загрузка заказов...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
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
                                <div className={`order-status status-${order.status}`}>
                                    {getStatusText(order.status)}
                                </div>
                            </div>
                            
                            <div className="order-items">
                                {order.items.map(item => (
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
                                <button 
                                    className="btn secondary-btn"
                                    onClick={() => navigate(`/order/${order.id}`)}
                                >
                                    Подробнее
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;