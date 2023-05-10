import axiosInstance from '@/libs/interceptor';
import { CartCreateAnonymousCartApiResponse } from '@/pages/api/cart/create-anonymous-cart';
import { CartGetCartApiResponse } from '@/pages/api/cart/get-cart';
import { CustomerCheckCustomerApiResponse } from '@/pages/api/customer/check-customer';
import env from '@/utils/env';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation, useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AppWrapper = ({ children }: IProps) => {
    const { data: session, status } = useSession();
    const { events } = useRouter();

    const [routeChangeLoading, setRouteChangeLoading] = useState(true);
    const [fetchingCartDetails, setFetchingCartDetails] = useState(true);
    const [cartId, setCartId] = useState<string | null>(null);

    const createAnonymousCartMutation = useMutation({
        mutationFn: createAnonymousCartAPI,
        onSuccess: (data) => {
            localStorage.setItem(env.redux.cartId, data.cartId);
            setFetchingCartDetails(false);
        },
    });

    useQuery({
        queryKey: ['cartData', cartId],
        queryFn: () => getCartAPI(cartId),
        enabled: Boolean(cartId),
        onError(err) {
            if (_.get(err, 'deleteCartId')) {
                localStorage.removeItem(env.redux.cartId);

                createAnonymousCartMutation.mutate();
            } else {
                setFetchingCartDetails(false);
            }
        },
        onSuccess(data) {
            setFetchingCartDetails(false);
        },
    });

    useQuery({
        queryKey: ['checkCustomer'],
        queryFn: checkCustomerAPI,
        enabled: status === 'authenticated',
        onSuccess(data) {
            const localCartId = localStorage.getItem(env.redux.cartId);
            const customerCartId = data.customer.cart.id;

            if (localCartId !== customerCartId) {
                setCartId(localCartId);
                localStorage.setItem(
                    env.redux.cartId,
                    data.customer.cart.cartId
                );
            } else {
                setFetchingCartDetails(false);
            }
        },
    });

    /**
     * Check session on every window reload
     */
    useEffect(() => {
        if (status != 'loading') {
            console.log('--------------------------------------------');
            console.log('Session data is');
            console.log({
                session,
            });
            console.log('--------------------------------------------');

            const cartId = localStorage.getItem(env.redux.cartId);
            if (status === 'unauthenticated') {
                // If customer is not authenticated

                if (!cartId) {
                    // If cart ID is not there in local storage, create new anonymous cart
                    createAnonymousCartMutation.mutate();
                } else {
                    // If cart ID is there in local storage, get the cart details
                    setCartId(cartId);
                }
            } else if (status === 'authenticated') {
                // If customer is authenticated

                if (!cartId) {
                } else {
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    /**
     * Add loader on every window reload
     */
    useEffect(() => {
        const disableLoaderTimeout = setTimeout(() => {
            setRouteChangeLoading(false);
        }, 10);

        return () => clearTimeout(disableLoaderTimeout);
    }, []);

    /**
     * Add loader on every route change
     */
    useEffect(() => {
        const start = () => {
            setRouteChangeLoading(true);
        };
        const end = () => {
            setRouteChangeLoading(false);
        };

        events.on('routeChangeStart', start);
        events.on('routeChangeComplete', end);
        events.on('routeChangeError', end);

        return () => {
            events.off('routeChangeStart', start);
            events.off('routeChangeComplete', end);
            events.off('routeChangeError', end);
        };
    }, [events]);

    if (status === 'loading' || routeChangeLoading || fetchingCartDetails) {
        return <PageLoader />;
    }

    return <Box>{children}</Box>;
};

export default AppWrapper;

interface IProps {
    children: JSX.Element[] | JSX.Element | null;
}

export const PageLoader = () => {
    return (
        <Box className="h-screen flex justify-center items-center absolute top-0 bottom-0 right-0 left-0 bg-white z-10">
            <CircularProgress />
        </Box>
    );
};

const createAnonymousCartAPI = async () => {
    const data: CartCreateAnonymousCartApiResponse = await axiosInstance.post(
        '/api/cart/create-anonymous-cart'
    );
    return data;
};

const getCartAPI = async (cartId: string | null) => {
    const data: CartGetCartApiResponse = await axiosInstance.get(
        `/api/cart/get-cart?cartId=${cartId}`
    );
    return data;
};

const checkCustomerAPI = async () => {
    const data: CustomerCheckCustomerApiResponse = await axiosInstance.get(
        '/api/customer/check-customer'
    );
    return data;
};
