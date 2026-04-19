import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            console.log('Attempting login with:', { username, password });
            
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Login response:', response.data);
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return response.data;
            } else {
                return rejectWithValue(response.data.error || 'Ошибка авторизации');
            }
        } catch (error) {
            console.error('Login error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            let errorMessage = 'Ошибка соединения с сервером';
            
            if (error.response) {
                errorMessage = error.response.data?.error || `Ошибка ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Сервер не отвечает. Проверьте, запущен ли сервер.';
            }
            
            return rejectWithValue(errorMessage);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ username, password, email }, { rejectWithValue }) => {
        try {
            console.log('Attempting registration:', { username, email });
            
            const response = await axios.post(`${API_URL}/register`, {
                username,
                password,
                email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Register response:', response.data);
            
            if (response.data.success) {
                return response.data;
            } else {
                return rejectWithValue(response.data.error || 'Ошибка регистрации');
            }
        } catch (error) {
            console.error('Register error details:', error);
            
            let errorMessage = 'Ошибка соединения с сервером';
            
            if (error.response) {
                errorMessage = error.response.data?.error || `Ошибка ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Сервер не отвечает. Проверьте, запущен ли сервер.';
            }
            
            return rejectWithValue(errorMessage);
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (!token || !user) {
            return rejectWithValue('No token or user');
        }
        
        try {
            const response = await axios.get(`${API_URL}/check-auth`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data.authenticated) {
                return { user, token };
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return rejectWithValue('Not authenticated');
            }
        } catch (error) {
            console.error('Check auth error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        token: localStorage.getItem('token') || null
    },
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
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = null;
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;