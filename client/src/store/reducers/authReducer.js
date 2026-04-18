import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
    CHECK_AUTH_REQUEST, CHECK_AUTH_SUCCESS, CHECK_AUTH_FAILURE,
    LOGOUT
} from '../actions/authActions';

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem('token') || null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
        case CHECK_AUTH_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
            
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
                error: null,
                token: localStorage.getItem('token')
            };
            
        case REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null
            };
            
        case CHECK_AUTH_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
                error: null
            };
            
        case LOGIN_FAILURE:
        case REGISTER_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            };
            
        case CHECK_AUTH_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: null,
                token: null
            };
            
        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                error: null
            };
            
        default:
            return state;
    }
};

export default authReducer;