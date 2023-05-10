import { Box, Button } from '@mui/material';
import { signIn } from 'next-auth/react';
import React from 'react';

const SignIn = () => {
    return (
        <Box>
            SignIn
            <Button
                variant="outlined"
                onClick={() => {
                    signIn('credentials', {
                        email: 'dev@harrsh.com',
                        password: 'Abcd',
                        callbackUrl: '/',
                    });
                }}
            >
                Sign In
            </Button>
        </Box>
    );
};

export default SignIn;
