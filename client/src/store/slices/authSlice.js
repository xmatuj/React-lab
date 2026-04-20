import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        token: localStorage.getItem('token'),
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.user = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                authApi.endpoints.login.matchFulfilled,
                (state, { payload }) => {
                    state.user = payload.user;
                    state.token = payload.token;
                    localStorage.setItem('token', payload.token);
                    localStorage.setItem('user', JSON.stringify(payload.user));
                }
            )
            .addMatcher(
                authApi.endpoints.checkAuth.matchFulfilled,
                (state, { payload }) => {
                    if (payload.authenticated) {
                        const user = JSON.parse(localStorage.getItem('user') || 'null');
                        state.user = user;
                        state.token = localStorage.getItem('token');
                    } else {
                        state.user = null;
                        state.token = null;
                    }
                }
            );
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;