import {
    CartGetCartProductApiResponse,
    CartGetCartProductsApiResponse,
} from '@/pages/api/cart/get-cart-products';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import Product from './Product';

const ProductsList = ({ products }: IProps) => {
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

                <tbody className="border-t border-b border-gray-200">
                    {products.map((product) => {
                        return <Product product={product} key={product.id} />;
                    })}
                </tbody>
            </table>

            {/* <Subtotal products={products} /> */}
        </Box>
    );
};

export default ProductsList;

interface IProps {
    products: CartGetCartProductApiResponse[];
}
