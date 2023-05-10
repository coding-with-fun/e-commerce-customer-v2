import serverCheckCustomerAuthentication from '@/helpers/serverCheckCustomerAuthentication';
import prisma from '@/libs/prisma';
import response from '@/libs/response';
import { cart, cartData, customer } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'GET') {
            throw new Error('API not found!');
        }

        // Authenticate customer
        const customerExists = await serverCheckCustomerAuthentication(
            req,
            res
        );
        const customer = await prisma.customer.findFirst({
            where: {
                id: customerExists.id,
            },
            include: {
                carts: {
                    where: {
                        deletedAt: null,
                        closedAt: null,
                    },
                    include: {
                        cartData: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        if (!customer) {
            res.statusCode = 401;
            throw new Error('Customer not found with the given ID.');
        }

        return response(res, {
            message: 'Customer data fetched successfully.',
            customer: {
                ...customer,
                cart: customer.carts[0],
            },
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;

export type CustomerCheckCustomerApiResponse = {
    message: string;
    customer: customer & {
        cart: cart & {
            cartData: cartData[];
        };
    };
};
