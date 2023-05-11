import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import toast from '@/libs/toast';
import { CartGetCartProductApiResponse } from '@/pages/api/cart/get-cart-products';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Box,
    ButtonBase,
    InputBase,
    Skeleton,
    Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import EmptyCart from './EmptyCart';

const Product = ({ product }: IProps) => {
    const { customerCart } = useAppSelector((state) => state.cart);
    const { push } = useRouter();

    const productSlug = product.title.split(' ').join('-') + `--${product.id}`;

    const [isImageLoading, setIsImageLoading] = useState(true);
    const [currentProduct, setCurrentProduct] = useState<
        CartGetCartProductApiResponse & {
            quantity: number;
        }
    >();

    useEffect(() => {
        if (customerCart) {
            const productInCart = customerCart.cartData.find(
                (el) => el.productId === product.id
            );

            if (productInCart) {
                setCurrentProduct({
                    ...product,
                    quantity: productInCart.quantity,
                });
            }
        }
    }, [product, customerCart]);

    useEffect(() => {
        const loadImage = setTimeout(() => {
            setIsImageLoading(false);
        }, 2000);

        return () => clearTimeout(loadImage);
    }, []);

    if (!customerCart) {
        return <EmptyCart />;
    }

    return currentProduct ? (
        <tr>
            <td>
                <Box
                    className="grid items-center gap-16"
                    sx={{
                        gridTemplateColumns: '10rem 1fr',
                    }}
                >
                    <Box className="relative w-[10rem] h-[10rem]">
                        <Image
                            priority
                            fill
                            src={product.coverImage || ''}
                            alt={product.title}
                            sizes="160px"
                            style={{
                                objectFit: 'contain',
                                cursor: 'pointer',
                                display: isImageLoading ? 'none' : 'block',
                            }}
                            onClick={() => {
                                push(`product/${productSlug}`);
                            }}
                        />

                        <Skeleton
                            variant="rounded"
                            width={'100%'}
                            height={'100%'}
                            sx={{
                                display: isImageLoading ? 'block' : 'none',
                                marginX: 'auto',
                            }}
                        />
                    </Box>

                    <Box className="pr-16 min-w-[200px] max-w-[750px]">
                        <Typography className="text-xs">
                            {product.seller?.name}
                        </Typography>

                        <Link
                            href={`/product/${productSlug}`}
                            className="hover:underline"
                        >
                            <Typography className="product-title font-semibold mt-1 mb-2">
                                {product.title}
                            </Typography>
                        </Link>

                        <Typography className="text-sm">
                            Rs. {product.price.toString()}
                        </Typography>
                    </Box>
                </Box>
            </td>

            <td className="w-[250px]">
                <Box className="flex items-center">
                    <Box className="flex items-center border border-[#28282B] border-solid w-fit">
                        <ButtonBase
                            className="w-11 h-11 flex cursor-pointer"
                            onClick={() => {
                                // handleRemoveFromCart();
                            }}
                        >
                            <RemoveIcon className="m-auto pointer-events-none w-4" />
                        </ButtonBase>

                        <InputBase
                            value={currentProduct.quantity}
                            // onChange={handleChangeItemsInCart}
                            className="w-12 h-11"
                            inputProps={{
                                className: 'text-center h-full w-full p-0',
                            }}
                        />

                        <ButtonBase
                            className="w-11 h-11 flex cursor-pointer"
                            onClick={() => {
                                // handleAddMoreToCart();
                            }}
                        >
                            <AddIcon className="m-auto pointer-events-none w-4" />
                        </ButtonBase>
                    </Box>

                    <Box className="flex items-center justify-center ml-4 cursor-pointer">
                        <DeleteOutlineOutlinedIcon
                            onClick={() => {
                                // handleProductToCart(0);
                            }}
                        />
                    </Box>
                </Box>
            </td>

            <td className="text-right w-[150px]">
                <Box>
                    <Typography>
                        Rs. {currentProduct.quantity * +currentProduct.price}
                    </Typography>
                </Box>
            </td>
        </tr>
    ) : (
        <EmptyCart />
    );
};

export default Product;

interface IProps {
    product: CartGetCartProductApiResponse;
}
