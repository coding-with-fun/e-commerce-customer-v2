import { ProductDetailsProduct } from '@/pages/api/product/[id]';
import { ProductListProduct } from '@/pages/api/product/list';

export type HomeProductType = ProductListProduct & {
    isFavorite: boolean;
    averageRating: number;
    totalRatings: number;
};

export type ProductDetailsType = ProductDetailsProduct & {
    isFavorite?: boolean;
};
