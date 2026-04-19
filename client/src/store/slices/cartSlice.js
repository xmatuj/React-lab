import { createSlice } from '@reduxjs/toolkit';

const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalAmount: 0,
        totalItems: 0
    },
    reducers: {
        addToCart: (state, action) => {
            const existingItemIndex = state.items.findIndex(
                item => item.id === action.payload.id
            );
            
            if (existingItemIndex >= 0) {
                state.items[existingItemIndex].quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            
            state.totalAmount = calculateTotalAmount(state.items);
            state.totalItems = calculateTotalItems(state.items);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.totalAmount = calculateTotalAmount(state.items);
            state.totalItems = calculateTotalItems(state.items);
        },
        updateQuantity: (state, action) => {
            const { itemId, quantity } = action.payload;
            const item = state.items.find(item => item.id === itemId);
            if (item) {
                item.quantity = quantity;
            }
            state.totalAmount = calculateTotalAmount(state.items);
            state.totalItems = calculateTotalItems(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.totalItems = 0;
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;