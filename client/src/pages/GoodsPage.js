import React from 'react';
import { Navigate } from 'react-router-dom';
import useServerGoods from '../hooks/useServerGoods';
import GoodsList from '../components/GoodsList';

const GoodsPage = ({ isAuthenticated }) => {
    const {
        items,
        loading,
        error,
        hasMore,
        total,
        category,
        changeCategory,
        loadMore
    } = useServerGoods(10);

    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const categories = [
        { value: 'all', label: 'Все категории' },
        { value: 'guitars', label: 'Гитары' },
        { value: 'keyboards', label: 'Клавишные' }
    ];

    return (
        <div className="container goods-page">
            <div className="goods-header">
                <h1>Каталог товаров</h1>
                <div className="category-filter">
                    <select 
                        value={category} 
                        onChange={(e) => changeCategory(e.target.value)}
                        disabled={loading}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {!loading && !error && items.length > 0 && (
                <p style={{ marginBottom: '20px', color: '#666' }}>
                    Найдено товаров: {total}
                </p>
            )}

            <GoodsList
                items={items}
                loading={loading}
                error={error}
                hasMore={hasMore}
                onLoadMore={loadMore}
            />
        </div>
    );
};

export default GoodsPage;