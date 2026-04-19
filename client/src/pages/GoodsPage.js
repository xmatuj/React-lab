import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GoodsList from '../components/GoodsList';
import { fetchGoods, setCategory } from '../store/slices/goodsSlice';

const GoodsPage = () => {
    const dispatch = useDispatch();
    const { items, loading, error, hasMore, total, category } = useSelector(state => state.goods);

    useEffect(() => {
        dispatch(fetchGoods({ page: 1, limit: 10, category, reset: true }));
    }, [dispatch, category]);

    const handleCategoryChange = (newCategory) => {
        dispatch(setCategory(newCategory));
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = Math.floor(items.length / 10) + 1;
            dispatch(fetchGoods({ page: nextPage, limit: 10, category, reset: false }));
        }
    };

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
                        onChange={(e) => handleCategoryChange(e.target.value)}
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
                onLoadMore={handleLoadMore}
            />
        </div>
    );
};

export default GoodsPage;