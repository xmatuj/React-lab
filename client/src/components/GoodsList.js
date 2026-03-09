import React from 'react';

const GoodsList = ({ items, loading, error, hasMore, onLoadMore }) => {
    if (loading && items.length === 0) {
        return <div className="loading">Загрузка товаров...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (items.length === 0) {
        return (
            <div className="error" style={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}>
                Товары не найдены
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    return (
        <div className="goods-table">
            <table>
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Дата выпуска</th>
                        <th>Цена</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{formatDate(item.releaseDate)}</td>
                            <td className="price">{formatPrice(item.price)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {hasMore && (
                <button 
                    className="load-more-btn"
                    onClick={onLoadMore}
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Загрузить больше'}
                </button>
            )}
            
            {loading && items.length > 0 && (
                <div className="loading" style={{ padding: '20px' }}>
                    Загрузка дополнительных товаров...
                </div>
            )}
        </div>
    );
};

export default GoodsList;