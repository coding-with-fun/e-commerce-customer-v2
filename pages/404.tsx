import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { Fragment } from 'react';

const PageNotFound = () => {
    return (
        <Fragment>
            <Head>
                <title>Page not found</title>
            </Head>

            <Box className="h-full flex items-center justify-center">
                <Typography component="h1" variant="h5">
                    Page not found!!
                </Typography>
            </Box>
        </Fragment>
    );
};

export default PageNotFound;
