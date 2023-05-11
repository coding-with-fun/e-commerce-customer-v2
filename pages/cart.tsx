import { PageLoader } from '@/HOC/AppWrapper';
import ProductsList from '@/components/Cart/ProductsList';
import { useAppSelector } from '@/hooks/redux';
import axiosInstance from '@/libs/interceptor';
import env from '@/utils/env';
import { useMutation } from '@tanstack/react-query';
import Head from 'next/head';
import { Fragment, useEffect, useRef, useState } from 'react';
import {
    CartGetCartProductApiResponse,
    CartGetCartProductsApiResponse,
} from './api/cart/get-cart-products';

const Cart = () => {
    const { customerCart } = useAppSelector((state) => state.cart);

    const [products, setProducts] = useState<CartGetCartProductApiResponse[]>(
        []
    );
    const isCartSet = useRef(false);

    const getCartProductsMutation = useMutation({
        mutationFn: getCartProductsAPI,
        onSuccess(data, variables, context) {
            setProducts(data.products);
            isCartSet.current = true;
        },
    });

    useEffect(() => {
        if (customerCart && !isCartSet.current) {
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
