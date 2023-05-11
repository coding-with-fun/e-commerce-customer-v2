import axiosInstance from '@/libs/interceptor';
import env from '@/utils/env';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const ContactForm = () => {
    const { asPath } = useRouter();

    const [countries, setCountries] = useState<
        {
            name: string;
        }[]
    >([]);

    useQuery({
        queryKey: ['getCountries'],
        queryFn: getCountries,
        onSuccess(data) {
            console.log({
                data: data.data,
            });

            setCountries(data.data || []);
        },
    });

    return (
        <Box>
            <Box>
                <Box className="flex justify-between">
                    <Typography>Contact</Typography>

                    <Box className="flex gap-1">
                        <Typography>Already have an account?</Typography>
                        <Typography
                            className="underline cursor-pointer"
                            onClick={() => {
                                signIn(undefined, {
                                    callbackUrl: asPath,
                                });
                            }}
                        >
                            Sign in
                        </Typography>
                    </Box>
                </Box>

                <TextField type="email" label="Email" fullWidth />
            </Box>

            <Box>
                <Typography>Shipping address</Typography>

                {countries.length ? (
                    <Autocomplete
                        autoHighlight
                        fullWidth
                        id="combo-box-demo"
                        options={countries}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField {...params} label="Movie" />
                        )}
                    />
                ) : null}
            </Box>
        </Box>
    );
};

export default ContactForm;

const getCountries = async () => {
    const data = await axiosInstance.get(`${env.api.countryAPI}/positions`);
    return data;
};
