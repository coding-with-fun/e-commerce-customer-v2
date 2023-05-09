import RATINGS from '@/data/ratings';
import prisma from '@/libs/prisma';
import response from '@/libs/response';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        console.log('Starting ratings seeder...');

        await prisma.rating.deleteMany();

        const products = await prisma.product.findMany();
        if (!products.length) {
            throw new Error('Please add at least one product!');
        }

        const customer = await prisma.customer.findFirst();
        if (!customer) {
            throw new Error('Customer not found!');
        }

        for (let product of products) {
            for (let rating of RATINGS) {
                await prisma.rating.create({
                    data: {
                        comment: rating.comment,
                        stars: Math.floor(Math.random() * 5) + 1,
                        productId: product.id,
                        customerId: customer.id,
                    },
                });
            }

            console.log(`Ratings created for product ${product.id}`);
        }

        console.log('Completed ratings seeder...');

        return response(res, {
            message: 'Ratings seeded successfully.',
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;
