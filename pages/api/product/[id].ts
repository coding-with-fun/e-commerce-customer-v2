import prisma from '@/libs/prisma';
import response from '@/libs/response';
import requestValidator from '@/middlewares/requestValidator';
import { product } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'GET') {
            throw new Error('API not found!');
        }

        console.log({
            query: req.query,
        });

        const parsedData = (await requestValidator(
            req,
            schema
        )) as productDetailsSchemaType;
        const {
            query: { id },
        } = parsedData;

        const product = await prisma.product.findFirst({
            where: {
                id,
                deletedAt: null,
                isActive: true,
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                favoriteBy: {
                    where: {
                        deletedAt: null,
                        isActive: true,
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!product) {
            throw new Error('Product not found.');
        }

        return response(res, {
            message: 'Product details fetched successfully.',
            product,
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;

const schema = z.object({
    query: z.object({
        id: z.string({
            required_error: 'Product ID is required.',
            invalid_type_error: 'Product ID is required.',
        }),
    }),
});

export type productDetailsSchemaType = z.infer<typeof schema>;

export type ProductDetailsProduct = product & {
    seller: {
        id: string;
        name: string;
    };
    favoriteBy?: {
        id: string;
    }[];
};

export type ProductDetailsApiResponse = {
    success: boolean;
    message: string;
    product: ProductDetailsProduct;
};
