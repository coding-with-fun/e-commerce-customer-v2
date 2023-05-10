import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CartGetCartApiResponse } from '@/pages/api/cart/get-cart';

export interface IInitialData {
    customerCart: CartGetCartApiResponse['cart'] | null;
}

const initialState: IInitialData = {
    customerCart: null,
};

const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.customerCart = action.payload.cart;
        },
    },
});

export const { setCart } = CartSlice.actions;

export const cart = (state: RootState): IInitialData => state.cart;

export default CartSlice.reducer;
