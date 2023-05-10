import { ProductListProduct } from '@/pages/api/product/list';

type HomeProductType = ProductListProduct & {
    isFavorite: boolean;
    averageRating: number;
    totalRatings: number;
};

export default HomeProductType;
