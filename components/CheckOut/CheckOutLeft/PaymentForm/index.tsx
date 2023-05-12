import { useAppSelector } from '@/hooks/redux';
import { Elements } from '@stripe/react-stripe-js';
import {
    Appearance,
    StripeElementsOptions,
    loadStripe,
} from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import CardForm from './CardForm';

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const PaymentForm = () => {
    const { customerCart } = useAppSelector((state) => state.cart);

    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (!customerCart) {
            return;
        }

        // Create PaymentIntent as soon as the page loads
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: customerCart.cartData.map((el) => el.productId),
            }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, [customerCart]);

    const appearance: Appearance = {
        theme: 'stripe',
    };
    const options: StripeElementsOptions = {
        clientSecret,
        appearance,
    };

    return clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
            <CardForm />
        </Elements>
    ) : null;
};

export default PaymentForm;
