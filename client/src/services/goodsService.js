import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const goodsService = {
  async fetchGoods({ page = 1, limit = 10, category = 'all' }) {
    const response = await axios.get(`${API_URL}/goods`, {
      params: {
        page,
        limit,
        category: category !== 'all' ? category : undefined
      }
    });
    return response.data;
  }
};