import { PageLoader } from '@/HOC/AppWrapper';
import { useAppSelector } from '@/hooks/redux';
import axiosInstance from '@/libs/interceptor';
import env from '@/utils/env';
import { Box } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, Fragment, useState } from 'react';
import {
    CartGetCartProductApiResponse,
    CartGetCartProductsApiResponse,
} from './api/cart/get-cart-products';
import Head from 'next/head';
import ProductsList from '@/components/Cart/ProductsList';

const Cart = () => {
    const { customerCart } = useAppSelector((state) => state.cart);

    const [products, setProducts] = useState<CartGetCartProductApiResponse[]>(
        []
    );

    const getCartProductsMutation = useMutation({
        mutationFn: getCartProductsAPI,
        onSuccess(data, variables, context) {
            setProducts(data.products);
        },
    });

    useEffect(() => {
        if (customerCart) {
            const productIds = customerCart.cartData.map((el) => el.productId);
            getCartProductsMutation.mutate(productIds);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerCart]);

    return getCartProductsMutation.isLoading ? (
        <PageLoader />
    ) : (
        <Fragment>
            <Head>
                <title>My Cart</title>
            </Head>

            <ProductsList products={products} />
        </Fragment>
    );
};

export default Cart;

const getCartProductsAPI = async (id: string[]) => {
    const data: CartGetCartProductsApiResponse = await axiosInstance.post(
        `${env.baseURL}/api/cart/get-cart-products`,
        {
            id,
        }
    );
    return data;
};
