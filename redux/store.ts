import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productReducer from './slice/products.slice';

const reducers = combineReducers({
    products: productReducer,
});

const store = configureStore({
    reducer: reducers,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
