import { useRouter } from 'next/router';
import React from 'react';

const PaymentSuccessful = () => {
    const router = useRouter();

    return <div>{JSON.stringify(router.query, null, 2)}</div>;
};

export default PaymentSuccessful;
