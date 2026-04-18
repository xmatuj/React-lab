import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Action Types
export const FETCH_GOODS_REQUEST = 'FETCH_GOODS_REQUEST';
export const FETCH_GOODS_SUCCESS = 'FETCH_GOODS_SUCCESS';
export const FETCH_GOODS_FAILURE = 'FETCH_GOODS_FAILURE';
export const SET_CATEGORY = 'SET_CATEGORY';

// Action Creators
export const setCategory = (category) => ({
    type: SET_CATEGORY,
    payload: category
});

export const fetchGoods = (page = 1, limit = 10, category = 'all', reset = false) => {
    return async (dispatch) => {
        dispatch({ type: FETCH_GOODS_REQUEST });
        
        try {
            const response = await axios.get(`${API_URL}/goods`, {
                params: {
                    page,
                    limit,
                    category: category !== 'all' ? category : undefined
                }
            });
            
            dispatch({
                type: FETCH_GOODS_SUCCESS,
                payload: {
                    ...response.data,
                    reset
                }
            });
        } catch (error) {
            dispatch({
                type: FETCH_GOODS_FAILURE,
                payload: error.response?.data?.error || 'Ошибка загрузки товаров'
            });
        }
    };
};