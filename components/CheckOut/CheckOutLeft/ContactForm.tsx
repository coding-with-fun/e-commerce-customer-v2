import axiosInstance from '@/libs/interceptor';
import env from '@/utils/env';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import {
    Autocomplete,
    Box,
    Button,
    TextField,
    Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const ContactForm = ({ setFormStep }: IProps) => {
    const { asPath } = useRouter();

    const [countries, setCountries] = useState<
        {
            name: string;
        }[]
    >([]);
    const [states, setStates] = useState<
        {
            name: string;
        }[]
    >([]);

    const formik = useFormik({
        initialValues: {
            email: '',
            country: '',
            firstName: '',
            lastName: '',
            address: '',
            apartment: '',
            city: '',
            state: '',
            pinCode: '',
            contactNumber: '',
        },
        onSubmit: async (values) => {
            console.log(values);
            setFormStep(1);
        },
    });

    useQuery({
        queryKey: ['getCountries'],
        queryFn: getCountries,
        onSuccess(data) {
            formik.setFieldValue('city', '');
            setStates([]);
            formik.setFieldValue('state', '');
            setCountries(data.data || []);
        },
        retry: false,
    });

    useQuery({
        queryKey: ['getStates', formik.values.country],
        queryFn: () =>
            getStates({
                country: formik.values.country,
            }),
        onSuccess(data) {
            setStates(data.data.states || []);
        },
        enabled: Boolean(formik.values.country),
        retry: false,
    });

    return (
        <Box
            noValidate
            component="form"
            autoComplete="off"
            onSubmit={formik.handleSubmit}
        >
            <Box className="flex flex-col gap-5 mb-7 mt-10">
                <Box className="flex justify-between items-center">
                    <Typography>Contact</Typography>

                    <Box className="flex gap-1">
                        <Typography className="text-sm">
                            Already have an account?
                        </Typography>

                        <Typography
                            className="underline cursor-pointer text-sm"
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

                <TextField
                    fullWidth
                    id="email"
                    type="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
            </Box>

            <Box className="flex flex-col gap-5">
                <Typography>Shipping address</Typography>

                <Box className="flex gap-5">
                    <TextField
                        fullWidth
                        id="firstName"
                        label="First name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                    />

                    <TextField
                        fullWidth
                        id="lastName"
                        label="Last name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                    />
                </Box>

                <Autocomplete
                    autoHighlight
                    fullWidth
                    disabled={!countries.length}
                    clearIcon={false}
                    value={{
                        name: formik.values.country,
                    }}
                    isOptionEqualToValue={(option, value) =>
                        formik.values.country
                            ? option.name === formik.values.country
                            : true
                    }
                    onChange={(event: any, value) => {
                        formik.setFieldValue('country', value?.name ?? 'India');

                        formik.setFieldValue('city', '');
                        setStates([]);
                        formik.setFieldValue('state', '');
                    }}
                    id="combo-box-demo"
                    options={countries}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField {...params} label="Country" />
                    )}
                />

                <TextField
                    fullWidth
                    id="address"
                    label="Address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    disabled={!Boolean(formik.values.country)}
                />

                <TextField
                    fullWidth
                    id="apartment"
                    label="Apartment, suite, etc. (optional)"
                    value={formik.values.apartment}
                    onChange={formik.handleChange}
                    disabled={!Boolean(formik.values.country)}
                />

                <Box className="flex gap-5">
                    <Autocomplete
                        autoHighlight
                        fullWidth
                        disabled={!states.length}
                        clearIcon={false}
                        value={{
                            name: formik.values.state,
                        }}
                        isOptionEqualToValue={(option, value) =>
                            formik.values.state
                                ? option.name === formik.values.state
                                : true
                        }
                        onChange={(event: any, value) => {
                            formik.setFieldValue(
                                'state',
                                value?.name ?? 'Gujarat'
                            );

                            formik.setFieldValue('city', '');
                        }}
                        id="combo-box-demo"
                        options={states}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField {...params} label="State" />
                        )}
                    />

                    <TextField
                        fullWidth
                        id="city"
                        label="City"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        disabled={
                            !Boolean(formik.values.country) ||
                            !Boolean(formik.values.state)
                        }
                    />

                    <TextField
                        fullWidth
                        id="pinCode"
                        label="Pin code"
                        value={formik.values.pinCode}
                        onChange={formik.handleChange}
                        disabled={
                            !Boolean(formik.values.country) ||
                            !Boolean(formik.values.state)
                        }
                    />
                </Box>

                <TextField
                    fullWidth
                    id="contactNumber"
                    label="Contact number"
                    value={formik.values.contactNumber}
                    onChange={formik.handleChange}
                    disabled={
                        !Boolean(formik.values.country) ||
                        !Boolean(formik.values.state)
                    }
                />

                <Box className="flex justify-between items-center">
                    <Link
                        className="flex gap-2 items-center cursor-pointer"
                        href="/cart"
                    >
                        <KeyboardArrowLeftIcon />

                        <Typography className="text-sm">
                            Go back to cart
                        </Typography>
                    </Link>

                    <Button type="submit" variant="outlined">
                        Continue
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ContactForm;

interface IProps {
    setFormStep: React.Dispatch<React.SetStateAction<number>>;
}

const getCountries = async () => {
    const data = await axiosInstance.get(`${env.api.countryAPI}/positions`);
    return data;
};

const getStates = async (body: { country: string }) => {
    const data = await axiosInstance.post(`${env.api.countryAPI}/states`, body);
    return data;
};
