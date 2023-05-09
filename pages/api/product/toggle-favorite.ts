import serverCheckCustomerAuthentication from '@/helpers/serverCheckCustomerAuthentication';
import prisma from '@/libs/prisma';
import response from '@/libs/response';
import requestValidator from '@/middlewares/requestValidator';
import type { NextApiRequest, NextApiResponse } from 'next';
import z from 'zod';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method !== 'POST') {
            throw new Error('API not found!');
        }

        // Get request parameters
        const parsedData = (await requestValidator(
            req,
            toggleFavoriteSchema
        )) as toggleFavoriteSchemaType;
        const {
            body: { productId },
        } = parsedData;

        // Find product
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
            },
        });
        if (!product) {
            throw new Error('Product not found.');
        }

        // Get authenticated customer
        const customer = await serverCheckCustomerAuthentication(req, res);

        // Check if customer favorite products has the given product
        const isFavorite = customer.favoriteProducts.some(
            (el) => el.id === productId
        );

        // Update the favorite status
        await prisma.customer.update({
            where: {
                id: customer.id,
            },
            data: {
                favoriteProducts: isFavorite
                    ? {
                          disconnect: {
                              id: productId,
                          },
                      }
                    : {
                          connect: {
                              id: productId,
                          },
                      },
            },
        });

        return response(res, {
            message: 'Status updated successfully.',
        });
    } catch (error) {
        return response(res, null, error);
    } finally {
        await prisma.$disconnect();
    }
};

export default handler;

const toggleFavoriteSchema = z.object({
    body: z.object({
        productId: z
            .string({
                invalid_type_error: 'Product ID is required.',
                required_error: 'Product ID is required.',
            })
            .nonempty('Product ID is required.'),
    }),
});
type toggleFavoriteSchemaType = z.infer<typeof toggleFavoriteSchema>;
