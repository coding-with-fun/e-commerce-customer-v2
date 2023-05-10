import Head from 'next/head';
import { Fragment } from 'react';

const NoProduct = () => {
    return (
        <Fragment>
            <Head>
                <title>No product found</title>
            </Head>

            <div>No product found</div>
        </Fragment>
    );
};

export default NoProduct;
