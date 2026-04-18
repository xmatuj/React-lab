import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import goodsReducer from './reducers/goodsReducer';
import cartReducer from './reducers/cartReducer';
import ordersReducer from './reducers/ordersReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    goods: goodsReducer,
    cart: cartReducer,
    orders: ordersReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;