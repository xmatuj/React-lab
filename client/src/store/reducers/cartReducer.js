import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_QUANTITY,
    CLEAR_CART
} from '../actions/cartActions';

const initialState = {
    items: [],
    totalAmount: 0,
    totalItems: 0
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const existingItemIndex = state.items.findIndex(
                item => item.id === action.payload.id
            );
            
            let updatedItems;
            
            if (existingItemIndex >= 0) {
                updatedItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
            }
            
            return {
                ...state,
                items: updatedItems,
                totalAmount: calculateTotalAmount(updatedItems),
                totalItems: calculateTotalItems(updatedItems)
            };
        }
        
        case REMOVE_FROM_CART: {
            const updatedItems = state.items.filter(item => item.id !== action.payload);
            
            return {
                ...state,
                items: updatedItems,
                totalAmount: calculateTotalAmount(updatedItems),
                totalItems: calculateTotalItems(updatedItems)
            };
        }
        
        case UPDATE_QUANTITY: {
            const updatedItems = state.items.map(item =>
                item.id === action.payload.itemId
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            
            return {
                ...state,
                items: updatedItems,
                totalAmount: calculateTotalAmount(updatedItems),
                totalItems: calculateTotalItems(updatedItems)
            };
        }
        
        case CLEAR_CART:
            return initialState;
            
        default:
            return state;
    }
};

const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
};

export default cartReducer;