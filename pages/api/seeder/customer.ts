import CUSTOMER from '@/data/customer';
import prisma from '@/libs/prisma';
import response from '@/libs/response';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        console.log('Starting customer seeder...');

        await prisma.customer.deleteMany();
        const customer = await prisma.customer.create({
            data: CUSTOMER,
        });

        await prisma.cart.create({
            data: {
                cartId: Date.now().toString(),
                customer: {
                    connect: {
                        id: customer.id,
                    },
                },
            },
        });

        console.log('Completed customer seeder...');

        return response(res, {
            message: 'Customer seeded successfully.',
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;
