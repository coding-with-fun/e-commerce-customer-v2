import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ProductListApiResponse } from '@/pages/api/product/list';
import HomeProductType from '@/types/homeProduct';

export interface IInitialData {
    products: HomeProductType[];
}

const initialState: IInitialData = {
    products: [],
};

const ProductSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            const payload = action.payload as {
                products: HomeProductType[];
            };
            state.products = [...payload.products];
        },

        toggleFavoriteProduct: (state, action) => {},
    },
});

export const { setProducts, toggleFavoriteProduct } = ProductSlice.actions;

export const product = (state: RootState): IInitialData => state.products;

export default ProductSlice.reducer;
