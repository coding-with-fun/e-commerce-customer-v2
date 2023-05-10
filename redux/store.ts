import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productReducer from './slice/products.slice';
import cartReducer from './slice/cart.slice';

const reducers = combineReducers({
    products: productReducer,
    cart: cartReducer,
});

const store = configureStore({
    reducer: reducers,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
