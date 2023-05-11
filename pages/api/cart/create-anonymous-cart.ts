import prisma from '@/libs/prisma';
import response from '@/libs/response';
import { cart, cartData } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        const cart = await prisma.cart.create({
            data: {
                cartId: Date.now().toString(),
            },
            include: {
                cartData: true,
            },
        });

        return response(res, {
            message: 'Cart created successfully.',
            cart,
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;

export type CartCreateAnonymousCartApiResponse = {
    message: string;
    cart: cart & {
        cartData: cartData[];
    };
};
