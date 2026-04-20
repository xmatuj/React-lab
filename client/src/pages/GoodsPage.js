import React, { useState, useEffect, useRef } from 'react';
import { useGetGoodsQuery } from '../store/api/goodsApi';
import GoodsList from '../components/GoodsList';

const GoodsPage = () => {
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState('all');
    const [allItems, setAllItems] = useState([]);
    const prevCategoryRef = useRef(category);
    
    const { data, isLoading, error, isFetching } = useGetGoodsQuery({
        page,
        limit: 10,
        category
    });

    // Обработка загруженных данных
    useEffect(() => {
        if (!data?.items) return;
        
        // Если сменилась категория - полностью заменяем данные
        if (prevCategoryRef.current !== category) {
            console.log('Category changed, resetting items');
            setAllItems(data.items);
            prevCategoryRef.current = category;
            return;
        }
        
        // Если это первая страница - заменяем данные
        if (page === 1) {
            console.log('Page 1, setting items');
            setAllItems(data.items);
        } else {
            // Для следующих страниц - добавляем только новые товары
            console.log(`Page ${page}, adding new items`);
            setAllItems(prev => {
                // Защита от дублирования - проверяем по ID
                const existingIds = new Set(prev.map(item => item.id));
                const newItems = data.items.filter(item => !existingIds.has(item.id));
                
                if (newItems.length === 0) {
                    console.warn('No new items to add - possible duplicate request');
                    return prev;
                }
                
                console.log(`Adding ${newItems.length} new items`);
                return [...prev, ...newItems];
            });
        }
    }, [data, page, category]);

    const handleCategoryChange = (newCategory) => {
        if (newCategory === category) return;
        
        console.log('Changing category to:', newCategory);
        setCategory(newCategory);
        setPage(1);
        // Не очищаем allItems здесь - это сделается в useEffect
    };

    const handleLoadMore = () => {
        if (!isFetching && data?.hasMore) {
            console.log('Loading more, next page:', page + 1);
            setPage(prev => prev + 1);
        }
    };

    const categories = [
        { value: 'all', label: 'Все категории' },
        { value: 'guitars', label: 'Гитары' },
        { value: 'keyboards', label: 'Клавишные' }
    ];

    if (isLoading && allItems.length === 0) {
        return <div className="loading">Загрузка товаров...</div>;
    }

    if (error && allItems.length === 0) {
        return <div className="error">Ошибка загрузки товаров</div>;
    }

    return (
        <div className="container goods-page">
            <div className="goods-header">
                <h1>Каталог товаров</h1>
                <div className="category-filter">
                    <select 
                        value={category} 
                        onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {data && data.total > 0 && (
                <p style={{ marginBottom: '20px', color: '#666' }}>
                    Найдено товаров: {data.total} (показано: {allItems.length})
                </p>
            )}

            <GoodsList
                items={allItems}
                loading={isLoading}
                error={error}
                hasMore={data?.hasMore || false}
                onLoadMore={handleLoadMore}
                isFetching={isFetching}
            />
        </div>
    );
};

export default GoodsPage;