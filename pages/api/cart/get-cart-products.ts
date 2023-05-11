import prisma from '@/libs/prisma';
import response from '@/libs/response';
import requestValidator from '@/middlewares/requestValidator';
import { product, seller } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const responseOptions = {
        deleteCartId: false,
    };

    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        // Get request parameters
        const parsedData = (await requestValidator(
            req,
            getCartProductsSchema
        )) as getCartProductsSchemaType;
        const {
            body: { id },
        } = parsedData;

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: id,
                },
            },
            include: {
                seller: true,
            },
        });

        return response(res, {
            message: 'Cart products fetched successfully.',
            products,
        });
    } catch (error) {
        return response(res, responseOptions, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;

const getCartProductsSchema = z.object({
    body: z.object({
        id: z
            .string()
            .array()
            .min(1, 'At least one product ID is required.')
            .nonempty('At least one product ID is required.'),
    }),
});
type getCartProductsSchemaType = z.infer<typeof getCartProductsSchema>;

export type CartGetCartProductApiResponse = product & {
    seller: seller;
};

export type CartGetCartProductsApiResponse = {
    products: CartGetCartProductApiResponse[];
};
