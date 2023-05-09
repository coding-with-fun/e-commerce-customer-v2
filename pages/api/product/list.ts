import prisma from '@/libs/prisma';
import response from '@/libs/response';
import pagination from '@/middlewares/cleanPagination';
import requestValidator from '@/middlewares/requestValidator';
import type { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        // Get query parameters
        const { page, perPage, query } = pagination(req);

        // Get request parameters
        const parsedData = (await requestValidator(
            req,
            sortSchema
        )) as sortSchemaType;
        const {
            query: { sortBy, sortDirection },
        } = parsedData;

        // Fetch data from database
        const [products, count] = await Promise.all([
            await prisma.product.findMany({
                where: {
                    isActive: true,
                    deletedAt: null,
                    AND: {
                        OR: [
                            {
                                title: {
                                    contains: query,
                                },
                            },
                            {
                                seller: {
                                    name: {
                                        contains: query,
                                    },
                                },
                            },
                        ],
                    },
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
                            isActive: true,
                            deletedAt: null,
                        },
                        select: {
                            id: true,
                        },
                    },
                },
                orderBy: {
                    [sortBy]: sortDirection,
                },
                take: perPage,
                skip: (page - 1) * perPage,
            }),

            await prisma.product.count({
                where: {
                    isActive: true,
                    deletedAt: null,
                    AND: {
                        OR: [
                            {
                                title: {
                                    contains: query,
                                },
                            },
                            {
                                seller: {
                                    name: {
                                        contains: query,
                                    },
                                },
                            },
                        ],
                    },
                },
            }),
        ]);

        return response(res, {
            message: 'Products fetched successfully.',
            products,
            pagination: {
                total: count,
                page,
                perPage,
            },
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;

const sortSchema = z.object({
    query: z.object({
        sortBy: z.string(),
        sortDirection: z.string(),
    }),
});
type sortSchemaType = z.infer<typeof sortSchema>;
