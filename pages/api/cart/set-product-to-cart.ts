import prisma from '@/libs/prisma';
import response from '@/libs/response';
import requestValidator from '@/middlewares/requestValidator';
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
            getCartSchema
        )) as getCartSchemaType;
        const {
            body: { cartId, productId, quantity },
        } = parsedData;

        // Find if cart exists
        const cart = await prisma.cart.findFirst({
            where: {
                id: cartId,
            },
            include: {
                cartData: true,
            },
        });
        if (!cart) {
            responseOptions.deleteCartId = true;
            throw new Error('Cart not found.');
        }

        // Find if product exists in the cart
        const productCart = cart.cartData.find(
            (el) => el.productId === productId
        );

        if (productCart) {
            if (quantity) {
                // If product exists and quantity is more than 0, update the cart
                await prisma.cartData.update({
                    where: {
                        id: productCart.id,
                    },
                    data: {
                        quantity,
                    },
                });
            } else {
                // If product exists and quantity is 0, delete product from the cart
                await prisma.cartData.delete({
                    where: {
                        id: productCart.id,
                    },
                });
            }
        } else if (quantity) {
            // If product does not exist and quantity is more than 0, create product in the cart
            await prisma.cartData.create({
                data: {
                    quantity,
                    cart: {
                        connect: {
                            id: cartId,
                        },
                    },
                    product: {
                        connect: {
                            id: productId,
                        },
                    },
                },
            });
        }

        return response(res, {
            message: 'Product added to cart successfully.',
        });
    } catch (error) {
        return response(res, responseOptions, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;

const getCartSchema = z.object({
    body: z.object({
        cartId: z
            .string({
                invalid_type_error: 'Cart ID is required.',
                required_error: 'Cart ID is required.',
            })
            .nonempty('Cart ID is required.'),
        productId: z
            .string({
                invalid_type_error: 'Product ID is required.',
                required_error: 'Product ID is required.',
            })
            .nonempty('Product ID is required.'),
        quantity: z.number({
            required_error: 'Product quantity is required.',
            invalid_type_error: 'Product quantity is required.',
        }),
    }),
});
type getCartSchemaType = z.infer<typeof getCartSchema>;
