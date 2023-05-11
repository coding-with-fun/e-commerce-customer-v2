import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import ContactForm from './ContactForm';

const CheckOutLeft = () => {
    return (
        <Box className="flex-1">
            <Header />

            <ContactForm />
        </Box>
    );
};

export default CheckOutLeft;
