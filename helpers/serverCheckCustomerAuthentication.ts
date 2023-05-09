import prisma from '@/libs/prisma';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

const serverCheckCustomerAuthentication = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    // Check if customer is authenticated
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.statusCode = 401;
        throw new Error('You are not authenticated.');
    }

    // Check if customer exists in the database
    const customerID = session.customer.id;
    const customer = await prisma.customer.findFirst({
        where: {
            id: customerID,
        },
    });
    if (!customer) {
        res.statusCode = 401;
        throw new Error('Customer not found with the given ID.');
    }

    if (!customer.isActive) {
        res.statusCode = 401;
        throw new Error('Your account has been deactivated.');
    }

    if (customer.deletedAt) {
        res.statusCode = 401;
        throw new Error('Your account has been deleted.');
    }

    return customer;
};

export default serverCheckCustomerAuthentication;
