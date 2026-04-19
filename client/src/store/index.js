import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import goodsReducer from './slices/goodsSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        goods: goodsReducer,
        cart: cartReducer,
        orders: ordersReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;