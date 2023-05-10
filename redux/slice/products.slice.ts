import { HomeProductType } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

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

        toggleFavoriteProduct: (state, action) => {
            const payload = action.payload;

            const index = state.products.findIndex(
                (el) => el.id === payload.id
            );
            state.products[index].isFavorite =
                !state.products[index].isFavorite;
        },
    },
});

export const { setProducts, toggleFavoriteProduct } = ProductSlice.actions;

export const product = (state: RootState): IInitialData => state.products;

export default ProductSlice.reducer;
