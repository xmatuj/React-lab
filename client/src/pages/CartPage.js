import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../store/actions/cartActions';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const handleQuantityChange = (itemId, quantity) => {
        if (quantity > 0) {
            dispatch(updateQuantity(itemId, quantity));
        }
    };

    const handleRemove = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
        }).format(price);
    };

    if (cart.items.length === 0) {
        return (
            <div className="container">
                <h1>Корзина</h1>
                <div className="empty-cart">
                    <p>Ваша корзина пуста</p>
                    <button 
                        className="btn primary-btn"
                        onClick={() => navigate('/goods')}
                    >
                        Перейти к покупкам
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Корзина</h1>
            
            <div className="cart-container">
                <div className="cart-items">
                    {cart.items.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-info">
                                <h3>{item.name}</h3>
                                <p className="price">{formatPrice(item.price)}</p>
                            </div>
                            
                            <div className="cart-item-actions">
                                <div className="quantity-control">
                                    <button 
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button 
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <p className="item-total">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                                
                                <button 
                                    className="remove-btn"
                                    onClick={() => handleRemove(item.id)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="cart-summary">
                    <h2>Итого</h2>
                    <p>Товаров: {cart.totalItems}</p>
                    <p className="total-amount">Сумма: {formatPrice(cart.totalAmount)}</p>
                    
                    <button 
                        className="btn primary-btn checkout-btn"
                        onClick={handleCheckout}
                    >
                        Оформить заказ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;