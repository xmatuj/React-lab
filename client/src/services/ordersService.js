import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const ordersService = {
  async fetchOrders(token) {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.orders;
  },

  async createOrder(orderData, token) {
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.order;
  }
};