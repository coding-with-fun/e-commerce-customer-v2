import { useAppSelector } from '@/hooks/redux';
import { CartGetCartProductApiResponse } from '@/pages/api/cart/get-cart-products';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import Product from './Product';
import Subtotal from './Subtotal';
import { cartData } from '@prisma/client';

const ProductsList = ({ products }: IProps) => {
    const { customerCart } = useAppSelector((state) => state.cart);

    return (
        <Box className="px-8 py-16">
            <Box className="flex items-center justify-between mb-12">
                <Typography variant="h4" component="h1">
                    Your cart
                </Typography>

                <Link href="/">
                    <Typography className="text-sm underline font-semibold">
                        Continue shopping
                    </Typography>
                </Link>
            </Box>

            <table className="w-full cart-table">
                <thead>
                    <tr>
                        <th
                            scope="col"
                            className="text-left uppercase text-gray-600 text-xs font-normal"
                        >
                            Product
                        </th>

                        <th
                            scope="col"
                            className="text-left uppercase text-gray-600 text-xs font-normal"
                        >
                            Quantity
                        </th>

                        <th
                            scope="col"
                            className="text-right uppercase text-gray-600 text-xs font-normal"
                        >
                            Total
                        </th>
                    </tr>
                </thead>
                {customerCart ? (
                    <tbody className="border-t border-b border-gray-200">
                        {customerCart.cartData.map((cartData: cartData) => {
                            const product = products.find(
                                (el) => el.id === cartData.productId
                            );

                            if (!product) {
                                return null;
                            }

                            return (
                                <Product
                                    product={product}
                                    key={cartData.id}
                                    cartData={cartData}
                                />
                            );
                        })}
                    </tbody>
                ) : null}
            </table>

            <Subtotal products={products} />
        </Box>
    );
};

export default ProductsList;

interface IProps {
    products: CartGetCartProductApiResponse[];
}
