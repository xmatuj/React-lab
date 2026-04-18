import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Action Types
export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAILURE = 'FETCH_ORDERS_FAILURE';
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';
export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS';

// Action Creators
export const fetchOrders = () => {
    return async (dispatch, getState) => {
        dispatch({ type: FETCH_ORDERS_REQUEST });
        
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            dispatch({
                type: FETCH_ORDERS_SUCCESS,
                payload: response.data.orders
            });
        } catch (error) {
            dispatch({
                type: FETCH_ORDERS_FAILURE,
                payload: error.response?.data?.error || 'Ошибка загрузки заказов'
            });
        }
    };
};

export const createOrder = (orderData) => {
    return async (dispatch, getState) => {
        dispatch({ type: CREATE_ORDER_REQUEST });
        
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/orders`, orderData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            dispatch({
                type: CREATE_ORDER_SUCCESS,
                payload: response.data.order
            });
            
            return { success: true, order: response.data.order };
        } catch (error) {
            dispatch({
                type: CREATE_ORDER_FAILURE,
                payload: error.response?.data?.error || 'Ошибка создания заказа'
            });
            return { success: false, error: error.response?.data?.error };
        }
    };
};

export const updateOrderStatus = (orderId, status) => ({
    type: UPDATE_ORDER_STATUS,
    payload: { orderId, status }
});