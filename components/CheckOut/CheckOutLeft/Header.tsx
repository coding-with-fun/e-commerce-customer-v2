import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import React from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

const Header = () => {
    return (
        <Box className="flex items-center w-full">
            <Link href="/cart" className="text-xs subdued-text">
                Cart
            </Link>

            <KeyboardArrowRightIcon className="text-xs mx-2" />

            <Typography className="text-xs">Information</Typography>

            <KeyboardArrowRightIcon className="text-xs mx-2" />

            <Typography className="text-xs subdued-text">Shipping</Typography>

            <KeyboardArrowRightIcon className="text-xs mx-2" />

            <Typography className="text-xs subdued-text">Payment</Typography>
        </Box>
    );
};

export default Header;
