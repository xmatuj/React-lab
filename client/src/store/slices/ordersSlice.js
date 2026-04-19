import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            return response.data.orders;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки заказов');
        }
    }
);

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/orders`, orderData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            return response.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Ошибка создания заказа');
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        loading: false,
        error: null,
        creating: false
    },
    reducers: {
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            const order = state.orders.find(order => order.id === orderId);
            if (order) {
                order.status = status;
            }
        },
        clearOrdersError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orders.push(action.payload);
                state.creating = false;
                state.error = null;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            });
    }
});

export const { updateOrderStatus, clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;