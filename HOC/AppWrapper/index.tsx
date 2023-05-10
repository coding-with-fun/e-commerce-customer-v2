import { useAppDispatch } from '@/hooks/redux';
import axiosInstance from '@/libs/interceptor';
import { CartCreateAnonymousCartApiResponse } from '@/pages/api/cart/create-anonymous-cart';
import { CartGetCartApiResponse } from '@/pages/api/cart/get-cart';
import { CustomerCheckCustomerApiResponse } from '@/pages/api/customer/check-customer';
import { setCart } from '@/redux/slice/cart.slice';
import env from '@/utils/env';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AppWrapper = ({ children }: IProps) => {
    const { data: session, status } = useSession();
    const { events } = useRouter();
    const dispatch = useAppDispatch();

    const [routeChangeLoading, setRouteChangeLoading] = useState(true);
    const [fetchingCartDetails, setFetchingCartDetails] = useState(true);
    const [localCartId, setLocalCartId] = useState<string | null>(null);

    const createAnonymousCartMutation = useMutation({
        mutationFn: createAnonymousCartAPI,
        onSuccess(data, variables, context) {
            localStorage.setItem(env.redux.cartId, data.cartId);
            setFetchingCartDetails(false);
        },
        onError(error, variables, context) {
            setFetchingCartDetails(false);
        },
    });

    useQuery({
        enabled: Boolean(localCartId),
        queryFn: () => getCartAPI(localCartId),
        queryKey: ['getCart', localCartId],
        onSuccess(data) {
            dispatch(
                setCart({
                    cart: data.cart,
                })
            );
            setFetchingCartDetails(false);
        },
        onError(err) {
            createAnonymousCartMutation.mutate();
        },
        retry: false,
    });

    useQuery({
        enabled: status === 'authenticated',
        queryFn: async () => {
            const localCartId = localStorage.getItem(env.redux.cartId);
            const data = await checkCustomerAPI(localCartId);
            return data;
        },
        queryKey: ['checkCustomer'],
        onSuccess(data) {
            console.log(data);
            localStorage.setItem(env.redux.cartId, data.customer.cart.id);
            setFetchingCartDetails(false);
        },
        onError(err) {
            setFetchingCartDetails(false);
        },
        retry: false,
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

            if (status === 'unauthenticated') {
                const localCartId = localStorage.getItem(env.redux.cartId);

                if (localCartId) {
                    setLocalCartId(localCartId);
                } else {
                    createAnonymousCartMutation.mutate();
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

const checkCustomerAPI = async (localCartId: string | null) => {
    const data: CustomerCheckCustomerApiResponse = await axiosInstance.get(
        `/api/customer/check-customer?localCartId=${localCartId}`
    );
    return data;
};
