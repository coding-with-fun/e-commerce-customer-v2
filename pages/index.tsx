import { PageLoader } from '@/HOC/AppWrapper';
import NoProduct from '@/components/Home/NoProduct';
import Product from '@/components/Home/Product';
import ScrollToTop from '@/components/ScrollToTop';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import axiosInstance from '@/libs/interceptor';
import toast from '@/libs/toast';
import { setProducts } from '@/redux/slice/products.slice';
import env from '@/utils/env';
import { Box } from '@mui/material';
import { omit } from 'lodash';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import { ProductListApiResponse } from './api/product/list';
import HomeProductType from '@/types/homeProduct';

const Home = ({ data }: { data: ProductListApiResponse }) => {
    const { data: session } = useSession();
    const products = useAppSelector((state) => state.products.products);
    const dispatch = useAppDispatch();

    const { message, products: resProducts, success } = data;

    const [processingProducts, setProcessingProducts] = useState(true);

    useEffect(() => {
        const data: HomeProductType[] = [];

        for (let product of resProducts) {
            const productData = {
                ...product,
            };

            const isFavorite =
                session && productData.favoriteBy
                    ? productData.favoriteBy.some(
                          (el) => el.id === session.customer.id
                      )
                    : false;

            const totalRatings = product._count.ratings;
            const averageRating =
                product.ratings.reduce(
                    (prev, current) => current.stars + prev,
                    0
                ) / totalRatings;

            omit(productData, 'favoriteBy');
            omit(productData, 'ratings');
            data.push({
                ...productData,
                isFavorite,
                averageRating,
                totalRatings,
            });
        }

        dispatch(
            setProducts({
                products: data,
            })
        );

        setProcessingProducts(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resProducts, session]);

    if (!success) {
        toast(message);
        return <NoProduct />;
    }

    if (!products.length && !processingProducts) {
        return <NoProduct />;
    }

    return (
        <Fragment>
            <Head>
                <title>Home</title>
            </Head>

            {processingProducts ? (
                <PageLoader />
            ) : (
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 'calc(100vw - 48px)',
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(330px, 1fr))',
                        gap: '1rem',
                        columnGap: '1rem',
                        marginX: 'auto',
                    }}
                >
                    {products.map((product) => {
                        return <Product key={product.id} product={product} />;
                    })}
                </Box>
            )}

            <ScrollToTop />
        </Fragment>
    );
};

export default Home;

const fetcher = async (page = 1, perPage = 10, query = '') => {
    const res: ProductListApiResponse = await axiosInstance.post(
        `${env.baseURL}/api/product/list?page=${page}&perPage=${perPage}&query=${query}`
    );

    return res;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const res: ProductListApiResponse = await fetcher();

        return {
            props: {
                data: res,
            },
        };
    } catch (error: any) {
        return {
            props: {
                data: {
                    ...error,
                    products: [],
                },
            },
        };
    }
};
