import SELLER from '@/data/seller';
import prisma from '@/libs/prisma';
import response from '@/libs/response';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        console.log('Starting seller seeder...');

        await prisma.seller.deleteMany();
        await prisma.seller.create({
            data: SELLER,
        });

        console.log('Completed seller seeder...');

        return response(res, {
            message: 'Seller seeded successfully.',
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;
