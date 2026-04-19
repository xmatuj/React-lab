import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const CHECK_AUTH_REQUEST = 'CHECK_AUTH_REQUEST';
export const CHECK_AUTH_SUCCESS = 'CHECK_AUTH_SUCCESS';
export const CHECK_AUTH_FAILURE = 'CHECK_AUTH_FAILURE';

// Action Creators
export const login = (username, password) => {
    return async (dispatch) => {
        dispatch({ type: LOGIN_REQUEST });
        
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
                
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: response.data.user
                });
                
                return { success: true };
            } else {
                dispatch({
                    type: LOGIN_FAILURE,
                    payload: response.data.error || 'Ошибка авторизации'
                });
                return { success: false, error: response.data.error };
            }
        } catch (error) {
            console.error('Login error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            let errorMessage = 'Ошибка соединения с сервером';
            
            if (error.response) {
                // Сервер ответил с ошибкой
                errorMessage = error.response.data?.error || `Ошибка ${error.response.status}`;
            } else if (error.request) {
                // Запрос был сделан, но ответ не получен
                errorMessage = 'Сервер не отвечает. Проверьте, запущен ли сервер.';
            }
            
            dispatch({
                type: LOGIN_FAILURE,
                payload: errorMessage
            });
            
            return { success: false, error: errorMessage };
        }
    };
};

export const register = (username, password, email) => {
    return async (dispatch) => {
        dispatch({ type: REGISTER_REQUEST });
        
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
                dispatch({
                    type: REGISTER_SUCCESS,
                    payload: response.data.user
                });
                return { success: true, user: response.data.user };
            } else {
                dispatch({
                    type: REGISTER_FAILURE,
                    payload: response.data.error || 'Ошибка регистрации'
                });
                return { success: false, error: response.data.error };
            }
        } catch (error) {
            console.error('Register error details:', error);
            
            let errorMessage = 'Ошибка соединения с сервером';
            
            if (error.response) {
                errorMessage = error.response.data?.error || `Ошибка ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Сервер не отвечает. Проверьте, запущен ли сервер.';
            }
            
            dispatch({
                type: REGISTER_FAILURE,
                payload: errorMessage
            });
            
            return { success: false, error: errorMessage };
        }
    };
};

export const checkAuth = () => {
    return async (dispatch) => {
        dispatch({ type: CHECK_AUTH_REQUEST });
        
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (!token || !user) {
            dispatch({ type: CHECK_AUTH_FAILURE });
            return;
        }
        
        try {
            const response = await axios.get(`${API_URL}/check-auth`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data.authenticated) {
                dispatch({
                    type: CHECK_AUTH_SUCCESS,
                    payload: user
                });
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                dispatch({ type: CHECK_AUTH_FAILURE });
            }
        } catch (error) {
            console.error('Check auth error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: CHECK_AUTH_FAILURE });
        }
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { type: LOGOUT };
};