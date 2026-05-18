import { createSlice } from '@reduxjs/toolkit';
import { addNotification } from './uiSlice';

const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateTotalItems = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
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
    },
  },
});

export const addToCartWithNotification = (item) => (dispatch) => {
  dispatch(cartSlice.actions.addToCart(item));
  dispatch(addNotification({
    message: `${item.name} добавлен в корзину`,
    type: 'success',
    duration: 2000
  }));
};

export const removeFromCartWithNotification = (itemId, itemName) => (dispatch) => {
  dispatch(cartSlice.actions.removeFromCart(itemId));
  dispatch(addNotification({
    message: `${itemName} удалён из корзины`,
    type: 'info',
    duration: 2000
  }));
};

export const updateQuantityWithNotification = (itemId, quantity, itemName) => (dispatch) => {
  dispatch(cartSlice.actions.updateQuantity({ itemId, quantity }));
  if (quantity > 0) {
    dispatch(addNotification({
      message: `${itemName}: количество изменено на ${quantity}`,
      type: 'info',
      duration: 1500
    }));
  }
};

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;