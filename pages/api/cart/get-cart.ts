import prisma from '@/libs/prisma';
import response from '@/libs/response';
import requestValidator from '@/middlewares/requestValidator';
import { cart, cartData } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const responseOptions = {
        deleteCartId: false,
    };

    try {
        if (req.method !== 'GET') {
            throw new Error('API not found!');
        }

        // Get request parameters
        const parsedData = (await requestValidator(
            req,
            getCartSchema
        )) as getCartSchemaType;
        const {
            query: { cartId },
        } = parsedData;

        // Get cart data
        const cart = await prisma.cart.findFirst({
            where: {
                id: cartId,
            },
            include: {
                cartData: true,
            },
        });
        if (!cart) {
            responseOptions.deleteCartId = true;
            throw new Error('Cart not found.');
        }

        return response(res, {
            message: 'Cart details fetched successfully.',
            cart,
        });
    } catch (error) {
        return response(res, responseOptions, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;

const getCartSchema = z.object({
    query: z.object({
        cartId: z
            .string({
                invalid_type_error: 'Cart ID is required.',
                required_error: 'Cart ID is required.',
            })
            .nonempty('Cart ID is required.'),
    }),
});
type getCartSchemaType = z.infer<typeof getCartSchema>;

export type CartGetCartApiResponse = {
    cart: cart & {
        cartData: cartData[];
    };
};
