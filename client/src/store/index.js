import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer, { authSaga } from './slices/authSlice';
import goodsReducer, { goodsSaga } from './slices/goodsSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer, { ordersSaga } from './slices/ordersSlice';
import uiReducer, { uiSaga } from './slices/uiSlice';
import { all } from 'redux-saga/effects';

function* rootSaga() {
  yield all([
    authSaga(),
    goodsSaga(),
    ordersSaga(),
    uiSaga(),
  ]);
}

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
    goods: goodsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;