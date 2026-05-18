import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, resetOrderCreated } from '../store/slices/ordersSlice';
import { clearCart } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(state => state.cart);
  const { creating, orderCreated, lastCreatedOrder } = useSelector(state => state.orders);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', email: '', phone: '', 
    address: '', city: '', paymentMethod: 'card', 
    cardNumber: '', cardExpiry: '', cardCvv: '' 
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (orderCreated && lastCreatedOrder) {
      dispatch(clearCart());
      dispatch(resetOrderCreated());
      navigate(`/order-confirmation/${lastCreatedOrder.id}`);
    }
  }, [orderCreated, lastCreatedOrder, dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? (checked ? value : prev.paymentMethod) : value
    }));
  };

  const validateStep = (stepNum) => {
    const newErrors = {};
    if (stepNum === 1) {
      if (!formData.firstName) newErrors.firstName = 'Введите имя';
      if (!formData.lastName) newErrors.lastName = 'Введите фамилию';
      if (!formData.email) newErrors.email = 'Введите email';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Введите корректный email';
      if (!formData.phone) newErrors.phone = 'Введите телефон';
    }
    if (stepNum === 2) {
      if (!formData.address) newErrors.address = 'Введите адрес';
      if (!formData.city) newErrors.city = 'Введите город';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => { if (validateStep(step)) setStep(step + 1); };
  const handlePrevStep = () => setStep(step - 1);

  const handleSubmitOrder = () => {
    dispatch(createOrder({ 
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
    }));
  };

  const formatPrice = (price) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(price);

  if (cart.items.length === 0 && !creating) { 
    navigate('/cart'); 
    return null; 
  }

  return (
    <div className="container">
      <h1>Оформление заказа</h1>
      
      <div className="checkout-steps" role="navigation" aria-label="Шаги оформления заказа">
        <div className={`step ${step >= 1 ? 'active' : ''}`} aria-current={step === 1 ? 'step' : undefined}>1. Контактная информация</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`} aria-current={step === 2 ? 'step' : undefined}>2. Доставка</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`} aria-current={step === 3 ? 'step' : undefined}>3. Оплата</div>
        <div className={`step ${step >= 4 ? 'active' : ''}`} aria-current={step === 4 ? 'step' : undefined}>4. Подтверждение</div>
      </div>
      
      <div className="checkout-content">
        {step === 1 && (
          <div className="checkout-step">
            <h2>Контактная информация</h2>
            <div>
              <div className="form-group">
                <label htmlFor="firstName">Имя *</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required aria-required="true" />
                {errors.firstName && <div className="error-message" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.firstName}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Фамилия *</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required aria-required="true" />
                {errors.lastName && <div className="error-message" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.lastName}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required aria-required="true" autoComplete="email" />
                {errors.email && <div className="error-message" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.email}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required aria-required="true" autoComplete="tel" />
                {errors.phone && <div className="error-message" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.phone}</div>}
              </div>
              <button type="button" className="btn primary-btn" onClick={handleNextStep} aria-label="Перейти к шагу доставки">Далее</button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="checkout-step">
            <h2>Адрес доставки</h2>
            <div>
              <div className="form-group">
                <label htmlFor="address">Адрес *</label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required aria-required="true" autoComplete="street-address" />
                {errors.address && <div className="error-message" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.address}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="city">Город *</label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required aria-required="true" autoComplete="address-level2" />
                {errors.city && <div className="error-message" style={{ fontSize: '12px', marginTop: '5px' }}>{errors.city}</div>}
              </div>
              <div className="step-buttons">
                <button type="button" className="btn secondary-btn" onClick={handlePrevStep} aria-label="Назад">Назад</button>
                <button type="button" className="btn primary-btn" onClick={handleNextStep} aria-label="Перейти к шагу оплаты">Далее</button>
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="checkout-step">
            <h2>Способ оплаты</h2>
            <div>
              <fieldset style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                <legend style={{ padding: '0 10px', fontWeight: 'bold' }}>Выберите способ оплаты</legend>
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card" 
                      checked={formData.paymentMethod === 'card'} 
                      onChange={handleInputChange}
                    />
                    <span>💳 Банковская карта</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cash" 
                      checked={formData.paymentMethod === 'cash'} 
                      onChange={handleInputChange}
                    />
                    <span>💰 Наличными при получении</span>
                  </label>
                </div>
              </fieldset>
              
              {formData.paymentMethod === 'card' && (
                <div style={{ marginTop: '20px' }}>
                  <h3>Данные карты</h3>
                  <div className="form-group">
                    <label htmlFor="cardNumber">Номер карты</label>
                    <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" autoComplete="cc-number" />
                  </div>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="cardExpiry">Срок действия</label>
                      <input type="text" id="cardExpiry" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} placeholder="ММ/ГГ" autoComplete="cc-exp" />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="cardCvv">CVV</label>
                      <input type="password" id="cardCvv" name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} placeholder="123" maxLength="3" autoComplete="cc-csc" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="step-buttons">
                <button type="button" className="btn secondary-btn" onClick={handlePrevStep} aria-label="Назад">Назад</button>
                <button type="button" className="btn primary-btn" onClick={handleNextStep} aria-label="Перейти к подтверждению">Далее</button>
              </div>
            </div>
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
              <button type="button" className="btn secondary-btn" onClick={handlePrevStep} aria-label="Назад">Назад</button>
              <button type="button" className="btn primary-btn" onClick={handleSubmitOrder} disabled={creating} aria-label={creating ? 'Обработка заказа' : 'Подтвердить заказ'}>
                {creating ? 'Обработка...' : 'Подтвердить заказ'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;