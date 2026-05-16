import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const authService = {
  async login(username, password) {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (!response.data.success) {
      throw new Error(response.data.error || 'Ошибка авторизации');
    }
    return response.data;
  },

  async register(username, password, email) {
    const response = await axios.post(`${API_URL}/register`, { username, password, email });
    if (!response.data.success) {
      throw new Error(response.data.error || 'Ошибка регистрации');
    }
    return response.data;
  },

  async checkAuth(token) {
    const response = await axios.get(`${API_URL}/check-auth`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};