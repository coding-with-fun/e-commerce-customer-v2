import { product } from '@prisma/client';

export const getSlug = (product: product) => {
    return product.title.split(' ').join('-') + `--${product.id}`;
};

export const formatAmount = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
};
