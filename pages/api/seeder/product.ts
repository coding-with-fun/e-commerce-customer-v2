import PRODUCTS from '@/data/products';
import prisma from '@/libs/prisma';
import response from '@/libs/response';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        console.log('Starting products seeder...');

        await prisma.product.deleteMany();

        const seller = await prisma.seller.findFirst();
        if (!seller) {
            throw new Error('Seller not found!');
        }

        for (let product of PRODUCTS) {
            const newProduct = await prisma.product.create({
                data: {
                    ...product,
                    sellerId: seller.id,
                },
            });
            console.log(`Seeded product ${newProduct.id}`);
        }

        console.log('Completed products seeder...');

        return response(res, {
            message: 'Products seeded successfully.',
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;
