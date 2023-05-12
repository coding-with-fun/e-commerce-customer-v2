import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import ContactForm from './ContactForm';
import PaymentForm from './PaymentForm';

const CheckOutLeft = () => {
    const [formStep, setFormStep] = useState(0);

    return (
        <Box className="flex-1 flex flex-col items-end">
            <Box className="w-3/5">
                <Header />

                {formStep === 0 ? (
                    <ContactForm setFormStep={setFormStep} />
                ) : (
                    <PaymentForm />
                )}
            </Box>
        </Box>
    );
};

export default CheckOutLeft;
