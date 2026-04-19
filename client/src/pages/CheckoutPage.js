import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../store/slices/ordersSlice';
import { clearCart } from '../store/slices/cartSlice';

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        paymentMethod: 'card',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: ''
    });
    const [processing, setProcessing] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const handleSubmitOrder = async () => {
        setProcessing(true);
        
        const orderData = {
            items: cart.items,
            totalAmount: cart.totalAmount,
            customerInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city
            },
            paymentMethod: formData.paymentMethod
        };

        try {
            const order = await dispatch(createOrder(orderData)).unwrap();
            dispatch(clearCart());
            navigate(`/order-confirmation/${order.id}`);
        } catch (error) {
            console.error('Order creation failed:', error);
        }
        
        setProcessing(false);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
        }).format(price);
    };

    if (cart.items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="container">
            <h1>Оформление заказа</h1>
            
            <div className="checkout-steps">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    1. Контактная информация
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    2. Доставка
                </div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    3. Оплата
                </div>
                <div className={`step ${step >= 4 ? 'active' : ''}`}>
                    4. Подтверждение
                </div>
            </div>
            
            <div className="checkout-content">
                {step === 1 && (
                    <div className="checkout-step">
                        <h2>Контактная информация</h2>
                        <form>
                            <div className="form-group">
                                <label>Имя</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Фамилия</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Телефон</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <button 
                                type="button"
                                className="btn primary-btn"
                                onClick={handleNextStep}
                                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                            >
                                Далее
                            </button>
                        </form>
                    </div>
                )}
                
                {step === 2 && (
                    <div className="checkout-step">
                        <h2>Адрес доставки</h2>
                        <form>
                            <div className="form-group">
                                <label>Адрес</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Город</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="step-buttons">
                                <button 
                                    type="button"
                                    className="btn secondary-btn"
                                    onClick={handlePrevStep}
                                >
                                    Назад
                                </button>
                                <button 
                                    type="button"
                                    className="btn primary-btn"
                                    onClick={handleNextStep}
                                    disabled={!formData.address || !formData.city}
                                >
                                    Далее
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {step === 3 && (
                    <div className="checkout-step">
                        <h2>Способ оплаты</h2>
                        <form>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={formData.paymentMethod === 'card'}
                                        onChange={handleInputChange}
                                    />
                                    Банковская карта
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={formData.paymentMethod === 'cash'}
                                        onChange={handleInputChange}
                                    />
                                    Наличными при получении
                                </label>
                            </div>
                            
                            {formData.paymentMethod === 'card' && (
                                <>
                                    <div className="form-group">
                                        <label>Номер карты</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            placeholder="0000 0000 0000 0000"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Срок действия</label>
                                        <input
                                            type="text"
                                            name="cardExpiry"
                                            value={formData.cardExpiry}
                                            onChange={handleInputChange}
                                            placeholder="MM/YY"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>CVV</label>
                                        <input
                                            type="password"
                                            name="cardCvv"
                                            value={formData.cardCvv}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                            maxLength="3"
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            
                            <div className="step-buttons">
                                <button 
                                    type="button"
                                    className="btn secondary-btn"
                                    onClick={handlePrevStep}
                                >
                                    Назад
                                </button>
                                <button 
                                    type="button"
                                    className="btn primary-btn"
                                    onClick={handleNextStep}
                                >
                                    Далее
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {step === 4 && (
                    <div className="checkout-step">
                        <h2>Подтверждение заказа</h2>
                        
                        <div className="order-summary">
                            <h3>Товары в заказе</h3>
                            {cart.items.map(item => (
                                <div key={item.id} className="summary-item">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                            
                            <div className="summary-total">
                                <strong>Итого: {formatPrice(cart.totalAmount)}</strong>
                            </div>
                            
                            <h3>Контактная информация</h3>
                            <p>{formData.firstName} {formData.lastName}</p>
                            <p>{formData.email}</p>
                            <p>{formData.phone}</p>
                            
                            <h3>Адрес доставки</h3>
                            <p>{formData.address}</p>
                            <p>{formData.city}</p>
                            
                            <h3>Способ оплаты</h3>
                            <p>{formData.paymentMethod === 'card' ? 'Банковская карта' : 'Наличными при получении'}</p>
                        </div>
                        
                        <div className="step-buttons">
                            <button 
                                type="button"
                                className="btn secondary-btn"
                                onClick={handlePrevStep}
                            >
                                Назад
                            </button>
                            <button 
                                type="button"
                                className="btn primary-btn"
                                onClick={handleSubmitOrder}
                                disabled={processing}
                            >
                                {processing ? 'Обработка...' : 'Подтвердить заказ'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;