import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AppWrapper = ({ children }: IProps) => {
    const { events } = useRouter();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const disableLoaderTimeout = setTimeout(() => {
            setLoading(false);
        }, 10);

        return () => clearTimeout(disableLoaderTimeout);
    }, []);

    useEffect(() => {
        const start = () => {
            setLoading(true);
        };
        const end = () => {
            setLoading(false);
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

    if (loading) {
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
