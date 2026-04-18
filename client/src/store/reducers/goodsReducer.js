// Action Types
export const FETCH_GOODS_REQUEST = 'FETCH_GOODS_REQUEST';
export const FETCH_GOODS_SUCCESS = 'FETCH_GOODS_SUCCESS';
export const FETCH_GOODS_FAILURE = 'FETCH_GOODS_FAILURE';
export const SET_CATEGORY = 'SET_CATEGORY';
export const LOAD_MORE_GOODS = 'LOAD_MORE_GOODS';

// Initial State
const initialState = {
    items: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    total: 0,
    category: 'all'
};

// Reducer
const goodsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_GOODS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
            
        case FETCH_GOODS_SUCCESS:
            return {
                ...state,
                items: action.payload.reset ? action.payload.items : [...state.items, ...action.payload.items],
                total: action.payload.total,
                hasMore: action.payload.hasMore,
                loading: false,
                error: null,
                page: action.payload.reset ? 1 : state.page + 1
            };
            
        case FETCH_GOODS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
            
        case SET_CATEGORY:
            return {
                ...state,
                category: action.payload,
                items: [],
                page: 1,
                hasMore: true
            };
            
        default:
            return state;
    }
};

export default goodsReducer;