import {
    FETCH_ORDERS_REQUEST,
    FETCH_ORDERS_SUCCESS,
    FETCH_ORDERS_FAILURE,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    UPDATE_ORDER_STATUS
} from '../actions/ordersActions';

const initialState = {
    orders: [],
    loading: false,
    error: null,
    creating: false
};

const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
            
        case FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.payload,
                loading: false,
                error: null
            };
            
        case FETCH_ORDERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
            
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                creating: true,
                error: null
            };
            
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                orders: [...state.orders, action.payload],
                creating: false,
                error: null
            };
            
        case CREATE_ORDER_FAILURE:
            return {
                ...state,
                creating: false,
                error: action.payload
            };
            
        case UPDATE_ORDER_STATUS:
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.id === action.payload.orderId
                        ? { ...order, status: action.payload.status }
                        : order
                )
            };
            
        default:
            return state;
    }
};

export default ordersReducer;