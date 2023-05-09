import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface IInitialData {
    products: any[];
}

const initialState: IInitialData = {
    products: [],
};

const ProductSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        toggleFavoriteProduct: (state, action) => {},
    },
});

export const { toggleFavoriteProduct } = ProductSlice.actions;

export const product = (state: RootState): IInitialData => state.products;

export default ProductSlice.reducer;
