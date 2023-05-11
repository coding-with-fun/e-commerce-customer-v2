import { useMemo } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { CartGetCartProductApiResponse } from '@/pages/api/cart/get-cart-products';
import { Box, ButtonBase, Typography } from '@mui/material';
import Link from 'next/link';
import { formatAmount } from '@/utils';

const Subtotal = ({ products }: IProps) => {
    const { customerCart } = useAppSelector((state) => state.cart);

    const subtotal = useMemo(() => {
        if (!customerCart) {
            return 0;
        }

        return products.reduce((prev, current) => {
            const productInCart = customerCart.cartData.find(
                (el) => el.productId === current.id
            );

            if (!productInCart) {
                return prev;
            }

            return prev + productInCart.quantity * +current.price;
        }, 0);
    }, [customerCart, products]);

    return (
        <Box className="flex justify-between mt-12">
            <Box />

            <Box className="flex flex-col items-end">
                <Box className="flex items-end gap-4">
                    <Typography className="text-xl font-semibold">
                        Subtotal
                    </Typography>
                    <Typography className="text-lg">
                        {formatAmount(subtotal)}
                    </Typography>
                </Box>

                <Box component="small" className="mt-5 mb-3">
                    Taxes & India shipping included.
                </Box>

                <Link href="/check-out">
                    <ButtonBase className="w-72 h-12 flex justify-center items-center border border-[#28282B] border-solid bg-[#28282B] text-white cursor-pointer">
                        <Typography>Check out</Typography>
                    </ButtonBase>
                </Link>
            </Box>
        </Box>
    );
};

export default Subtotal;

interface IProps {
    products: CartGetCartProductApiResponse[];
}
