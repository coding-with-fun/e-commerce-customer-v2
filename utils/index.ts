import { product } from '@prisma/client';

export const getSlug = (product: product) => {
    return product.title.split(' ').join('-') + `--${product.id}`;
};

export const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR',
    });
};
