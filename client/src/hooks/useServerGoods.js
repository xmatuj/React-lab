import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const useServerGoods = (initialLimit = 10) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [category, setCategory] = useState('all');

    const fetchGoods = useCallback(async (pageNum = 1, categoryFilter = category, reset = false) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_URL}/goods`, {
                params: {
                    page: pageNum,
                    limit: initialLimit,
                    category: categoryFilter !== 'all' ? categoryFilter : undefined
                }
            });

            const { items: newItems, total: totalCount, hasMore: more } = response.data;

            setItems(prev => reset ? newItems : [...prev, ...newItems]);
            setTotal(totalCount);
            setHasMore(more);
            setError(null);
        } catch (err) {
            setError('Ошибка соединения с сервером');
            console.error('Error fetching goods:', err);
        } finally {
            setLoading(false);
        }
    }, [initialLimit, category]);

    // Загрузка первой страницы при изменении категории
    useEffect(() => {
        setPage(1);
        fetchGoods(1, category, true);
    }, [category, fetchGoods]);

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchGoods(nextPage, category, false);
        }
    };

    const changeCategory = (newCategory) => {
        setCategory(newCategory);
    };

    const resetGoods = () => {
        setPage(1);
        setItems([]);
        setHasMore(true);
        fetchGoods(1, category, true);
    };

    return {
        items,
        loading,
        error,
        hasMore,
        total,
        category,
        changeCategory,
        loadMore,
        resetGoods
    };
};

export default useServerGoods;