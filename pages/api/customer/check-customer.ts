import z from 'zod';
import serverCheckCustomerAuthentication from '@/helpers/serverCheckCustomerAuthentication';
import prisma from '@/libs/prisma';
import response from '@/libs/response';
import { cart, cartData, customer } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import requestValidator from '@/middlewares/requestValidator';
import { unset } from 'lodash';

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

        // Get request parameters
        const parsedData = (await requestValidator(
            req,
            checkCustomerSchema
        )) as checkCustomerSchemaType;
        const {
            query: { localCartId },
        } = parsedData;

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

        let customerResponse: CustomerCustomerResponseType = {
            ...customer,
            cart: customer.carts[0],
        };
        unset(customerResponse, 'carts');

        const customerCartId = customerResponse.cart.id;
        const customerCartData = await prisma.cart.findFirst({
            where: {
                id: customerCartId,
            },
        });
        if (!customerCartData) {
            const newCart = await prisma.cart.create({
                data: {
                    cartId: Date.now().toString(),
                },
            });
            customerResponse.cart = newCart;
        }

        if (localCartId !== customerResponse.cart.id) {
            const localCartData = await prisma.cart.findFirst({
                where: {
                    id: localCartId,
                },
                include: {
                    cartData: true,
                },
            });
            if (localCartData) {
                const updatedCustomerCart = await prisma.cart.update({
                    where: {
                        id: customerResponse.cart.id,
                    },
                    data: {
                        cartData: {
                            createMany: {
                                data: localCartData.cartData,
                            },
                        },
                    },
                });
                customerResponse.cart = updatedCustomerCart;
                await prisma.cart.delete({
                    where: {
                        id: localCartData.id,
                    },
                });
            }
        }

        return response(res, {
            message: 'Customer data fetched successfully.',
            customer: customerResponse,
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;

const checkCustomerSchema = z.object({
    query: z.object({
        localCartId: z
            .string({
                invalid_type_error: 'Cart ID is required.',
                required_error: 'Cart ID is required.',
            })
            .nonempty('Cart ID is required.'),
    }),
});
type checkCustomerSchemaType = z.infer<typeof checkCustomerSchema>;

export type CustomerCheckCustomerApiResponse = {
    message: string;
    customer: Omit<CustomerCustomerResponseType, 'carts'>;
};

export type CustomerCustomerResponseType = customer & {
    carts: (cart & {
        cartData: cartData[];
    })[];
    cart:
        | (cart & {
              cartData: cartData[];
          })
        | cart;
};
