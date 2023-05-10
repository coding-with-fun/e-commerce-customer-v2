import WarningIcon from '@/public/assets/icons/warning.png';
import { Box, Button, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const SignInAlert = () => {
    const { asPath } = useRouter();

    return (
        <Box className="flex flex-col items-center gap-4">
            <Image src={WarningIcon} alt="Warning" width={70} height={70} />

            <Box className="flex flex-col text-center gap-2">
                <Typography className="font-semibold">
                    You are currently not signed in.
                </Typography>
                <Typography>
                    To favorite a product, you need to sign in first.
                </Typography>
            </Box>

            <Button
                variant="outlined"
                onClick={() => {
                    signIn(undefined, {
                        callbackUrl: asPath,
                    });
                }}
                className="cursor-pointer"
            >
                Sign In
            </Button>
        </Box>
    );
};

export default SignInAlert;
