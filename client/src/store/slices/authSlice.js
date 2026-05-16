import axios from 'axios';
import { createSagaSlice } from '../createSagaSlice';

const API_URL = 'http://localhost:3001/api';

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  token: localStorage.getItem('token') || null,
};

const { reducer, actions, saga } = createSagaSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    restoreAuth: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  asyncReducers: {
    login: {
      handler: async ({ username, password }) => {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        if (!response.data.success) {
          throw new Error(response.data.error || 'Ошибка авторизации');
        }
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      },
      onSuccess: (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.loading = false;
      },
      onFailure: (state, action) => {
        // Убеждаемся, что error - строка
        state.error = typeof action.payload === 'string' ? action.payload : 'Ошибка авторизации';
        state.loading = false;
      },
    },
    register: {
      handler: async ({ username, password, email }) => {
        const response = await axios.post(`${API_URL}/register`, { username, password, email });
        if (!response.data.success) {
          throw new Error(response.data.error || 'Ошибка регистрации');
        }
        return response.data;
      },
      onSuccess: (state, action) => {
        state.error = null;
        state.loading = false;
      },
      onFailure: (state, action) => {
        // Убеждаемся, что error - строка
        state.error = typeof action.payload === 'string' ? action.payload : 'Ошибка регистрации';
        state.loading = false;
      },
    },
  },
});

export const { login, register, logout, clearError, restoreAuth } = actions;
export const authSaga = saga;
export default reducer;