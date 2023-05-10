import { PageLoader } from '@/HOC/AppWrapper';
import Details from '@/components/Product/Details';
import NoProduct from '@/components/Product/Details/NoProduct';
import axiosInstance from '@/libs/interceptor';
import toast from '@/libs/toast';
import { ProductDetailsType } from '@/types';
import env from '@/utils/env';
import { omit } from 'lodash';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import { ProductDetailsApiResponse } from '../api/product/[id]';

const Product = ({ data }: { data: ProductDetailsApiResponse }) => {
    const { data: session } = useSession();

    const [product, setProduct] = useState<ProductDetailsType>();

    const { message, product: resProduct, success } = data;

    useEffect(() => {
        const tempProduct: ProductDetailsType = {
            ...resProduct,
        };

        tempProduct.isFavorite =
            session && tempProduct.favoriteBy
                ? tempProduct.favoriteBy.some(
                      (el) => el.id === session.customer.id
                  )
                : false;
        omit(tempProduct, 'favoriteBy');

        setProduct({
            ...tempProduct,
        });
    }, [resProduct, session]);

    if (!success) {
        toast(message);
        return <NoProduct />;
    }

    return product ? (
        <Fragment>
            <Head>
                <title>{product.title}</title>
            </Head>

            <Details product={product} />
        </Fragment>
    ) : (
        <PageLoader />
    );
};

export default Product;

const fetcher = async (id: string) => {
    const res: ProductDetailsApiResponse = await axiosInstance.get(
        `${env.baseURL}/api/product/${id}`
    );

    return res;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { id } = context.query;
        const productID = (id as string).split('--').pop() as string;
        console.log({
            productID,
        });

        const res: ProductDetailsApiResponse = await fetcher(productID);

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
