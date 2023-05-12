import response from '@/libs/response';
import env from '@/utils/env';
import type { NextApiRequest, NextApiResponse } from 'next';
// const stripe = require('stripe')(env.stripe.secretKey);
import stripeInstance from 'stripe';
const stripe = new stripeInstance(env.stripe.secretKey, {
    apiVersion: '2022-11-15',
});
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000,
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        return response(res, null, error);
    }
};

export default handler;
