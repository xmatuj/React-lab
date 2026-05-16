import { ordersService } from '../../services/ordersService';
import { createSagaSlice } from '../createSagaSlice';

const initialState = {
  orders: [],
  loading: false,
  error: null,
  creating: false,
  orderCreated: false,
  lastCreatedOrder: null,
};

const { reducer, actions, saga } = createSagaSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
      }
    },
    resetOrderCreated: (state) => {
      state.orderCreated = false;
      state.lastCreatedOrder = null;
    },
  },
  asyncReducers: {
    fetchOrders: {
      handler: async (_, state) => {
        const token = state.auth.token || localStorage.getItem('token');
        if (!token) throw new Error('Требуется авторизация');
        return await ordersService.fetchOrders(token);
      },
      onSuccess: (state, action) => {
        state.orders = action.payload;
        state.error = null;
      },
      onFailure: (state, action) => {
        state.error = action.payload;
        state.loading = false;
      },
      loadingKey: 'loading',
      errorKey: 'error',
    },
    createOrder: {
      handler: async (orderData, state) => {
        const token = state.auth.token || localStorage.getItem('token');
        if (!token) throw new Error('Требуется авторизация');
        return await ordersService.createOrder(orderData, token);
      },
      onRequest: (state) => {
        state.creating = true;
        state.error = null;
        state.orderCreated = false;
        state.lastCreatedOrder = null;
      },
      onSuccess: (state, action) => {
        state.orders.push(action.payload);
        state.creating = false;
        state.orderCreated = true;
        state.lastCreatedOrder = action.payload;
      },
      onFailure: (state, action) => {
        state.creating = false;
        state.orderCreated = false;
        state.error = action.payload;
      },
      loadingKey: 'creating',
      errorKey: 'error',
    },
  },
});

export const { 
  fetchOrders, 
  createOrder, 
  clearOrdersError, 
  updateOrderStatus,
  resetOrderCreated 
} = actions;
export const ordersSaga = saga;
export default reducer;