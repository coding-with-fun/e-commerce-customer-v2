import axiosInstance from '@/libs/interceptor';
import { CustomerCheckCustomerApiResponse } from '@/pages/api/customer/check-customer';
import env from '@/utils/env';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

const AppWrapper = ({ children }: IProps) => {
    const { data: session, status } = useSession();
    const { events } = useRouter();

    const [routeChangeLoading, setRouteChangeLoading] = useState(true);
    const [customerDataFetched, setCustomerDataFetched] = useState(false);

    const { refetch } = useQuery({
        queryFn: checkCustomerAPI,
        enabled: false,
        onSuccess(data) {},
    });

    const handleGetCart = async () => {
        const storedCart = localStorage.getItem(env.redux.cartId);

        if (storedCart) {
        }
    };

    useEffect(() => {
        console.log('--------------------------------------------');
        console.log('Session data is');
        console.log({
            session,
        });
        console.log('--------------------------------------------');

        if (session) {
            refetch();
        } else {
            setCustomerDataFetched(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    useEffect(() => {
        const disableLoaderTimeout = setTimeout(() => {
            setRouteChangeLoading(false);
        }, 10);

        return () => clearTimeout(disableLoaderTimeout);
    }, []);

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

    if (status === 'loading' || routeChangeLoading || !customerDataFetched) {
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

const checkCustomerAPI = async () => {
    const res: CustomerCheckCustomerApiResponse = await axiosInstance(
        '/api/customer/check-customer'
    );
    return res;
};
