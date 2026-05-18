import { createSlice } from '@reduxjs/toolkit';
import { addNotification } from './uiSlice';

const loadCartFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token && user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        return {
          items: parsed.items || [],
          totalAmount: parsed.totalAmount || 0,
          totalItems: parsed.totalItems || 0,
          userId: user.id,
        };
      }
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }
  return { items: [], totalAmount: 0, totalItems: 0, userId: null };
};

const saveCartToStorage = (state) => {
  try {
    if (state.userId) {
      localStorage.setItem(`cart_${state.userId}`, JSON.stringify({
        items: state.items,
        totalAmount: state.totalAmount,
        totalItems: state.totalItems,
      }));
    }
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

const calculateTotalAmount = (items) => items.reduce((total, item) => total + (item.price * item.quantity), 0);
const calculateTotalItems = (items) => items.reduce((total, item) => total + item.quantity, 0);

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setUserCart: (state, action) => {
      const { userId, cart } = action.payload;
      state.userId = userId;
      if (cart && cart.items) {
        state.items = cart.items;
        state.totalAmount = cart.totalAmount;
        state.totalItems = cart.totalItems;
      } else {
        const savedCart = localStorage.getItem(`cart_${userId}`);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          state.items = parsed.items || [];
          state.totalAmount = parsed.totalAmount || 0;
          state.totalItems = parsed.totalItems || 0;
        }
      }
      saveCartToStorage(state);
    },
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalAmount = calculateTotalAmount(state.items);
      state.totalItems = calculateTotalItems(state.items);
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalAmount = calculateTotalAmount(state.items);
      state.totalItems = calculateTotalItems(state.items);
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.id !== itemId);
        } else {
          item.quantity = quantity;
        }
      }
      state.totalAmount = calculateTotalAmount(state.items);
      state.totalItems = calculateTotalItems(state.items);
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      if (state.userId) {
        localStorage.removeItem(`cart_${state.userId}`);
      }
    },
    restoreCart: (state, action) => {
      const { userId, items, totalAmount, totalItems } = action.payload;
      state.userId = userId;
      state.items = items || [];
      state.totalAmount = totalAmount || 0;
      state.totalItems = totalItems || 0;
      saveCartToStorage(state);
    },
  },
});

export const addToCartWithNotification = (item) => (dispatch, getState) => {
  dispatch(cartSlice.actions.addToCart(item));
  dispatch(addNotification({ message: `${item.name} добавлен в корзину`, type: 'success', duration: 3000 }));
};

export const removeFromCartWithNotification = (itemId, itemName) => (dispatch) => {
  dispatch(cartSlice.actions.removeFromCart(itemId));
  dispatch(addNotification({ message: `${itemName} удалён из корзины`, type: 'info', duration: 3000 }));
};

export const updateQuantityWithNotification = (itemId, quantity, itemName) => (dispatch) => {
  if (quantity <= 0) {
    dispatch(cartSlice.actions.removeFromCart(itemId));
    dispatch(addNotification({ message: `${itemName} удалён из корзины`, type: 'info', duration: 3000 }));
  } else {
    dispatch(cartSlice.actions.updateQuantity({ itemId, quantity }));
    dispatch(addNotification({ message: `${itemName}: количество изменено на ${quantity}`, type: 'info', duration: 2000 }));
  }
};

export const { addToCart, removeFromCart, updateQuantity, clearCart, setUserCart, restoreCart } = cartSlice.actions;
export default cartSlice.reducer;