import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCartWithNotification } from '../store/slices/cartSlice';

const GoodsList = ({ items, loading, error, hasMore, onLoadMore }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(addToCartWithNotification(item));
  };

  if (loading && items.length === 0) {
    return <div className="loading" aria-live="polite">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="error" role="alert" aria-live="assertive">{error}</div>;
  }

  if (items.length === 0) {
    return <div className="error" style={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}>Товары не найдены</div>;
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ru-RU');
  const formatPrice = (price) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price);

  return (
    <>
      <div className="goods-table desktop-view">
        <table aria-label="Список товаров">
          <thead>
            <tr>
              <th scope="col">Название</th>
              <th scope="col">Дата выпуска</th>
              <th scope="col">Цена</th>
              <th scope="col">Действие</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <th scope="row" style={{ textAlign: 'left', fontWeight: 'normal' }}>{item.name}</th>
                <td>{formatDate(item.releaseDate)}</td>
                <td className="price">{formatPrice(item.price)}</td>
                <td>
                  <button className="btn add-to-cart-btn" onClick={() => handleAddToCart(item)} aria-label={`Добавить ${item.name} в корзину`}>
                    В корзину
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="goods-list mobile-view">
        {items.map(item => (
          <div key={item.id} className="goods-card">
            <div className="goods-card-info">
              <h3 className="goods-card-name">{item.name}</h3>
              <div className="goods-card-details">
                <span className="goods-card-date">📅 {formatDate(item.releaseDate)}</span>
                <span className="goods-card-price">{formatPrice(item.price)}</span>
              </div>
            </div>
            <button className="btn add-to-cart-btn" onClick={() => handleAddToCart(item)} aria-label={`Добавить ${item.name} в корзину`}>
              В корзину
            </button>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <button className="load-more-btn" onClick={onLoadMore} disabled={loading} aria-label="Загрузить больше товаров">
          {loading ? 'Загрузка...' : 'Загрузить больше'}
        </button>
      )}
      
      {loading && items.length > 0 && <div className="loading" style={{ padding: '20px' }} aria-live="polite">Загрузка дополнительных товаров...</div>}
    </>
  );
};

export default GoodsList;