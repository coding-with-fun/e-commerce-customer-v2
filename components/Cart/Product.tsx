import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import axiosInstance from '@/libs/interceptor';
import toast from '@/libs/toast';
import { CartGetCartProductApiResponse } from '@/pages/api/cart/get-cart-products';
import { CartSetProductToCartApiResponse } from '@/pages/api/cart/set-product-to-cart';
import { setCart } from '@/redux/slice/cart.slice';
import env from '@/utils/env';
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
import { useMutation } from '@tanstack/react-query';
import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import EmptyCart from './EmptyCart';
import { cartData } from '@prisma/client';

const Product = ({ product, cartData }: IProps) => {
    const dispatch = useAppDispatch();
    const { customerCart } = useAppSelector((state) => state.cart);
    const { push } = useRouter();

    const productSlug = product.title.split(' ').join('-') + `--${product.id}`;

    const [isImageLoading, setIsImageLoading] = useState(true);
    const [currentProduct, setCurrentProduct] =
        useState<CartGetCartProductApiResponse>();
    const [quantity, setQuantity] = useState(0);
    const changeInQuantity = useRef(false);

    const handleChangeItemsInCart = (e: ChangeEvent<HTMLInputElement>) => {
        let value: number | string = e.target.value;

        if (!isNaN(+value)) {
            value = +value;
            changeInQuantity.current = true;
            setQuantity(value);
        }
    };

    const handleAddMoreToCart = () => {
        if (product.quantity > quantity) {
            changeInQuantity.current = true;
            setQuantity((prev) => prev + 1);
        }
    };

    const handleRemoveFromCart = () => {
        if (quantity > 0) {
            changeInQuantity.current = true;
            setQuantity((prev) => prev - 1);
        }
    };

    const handleProductToCart = (alteredQuantity = quantity) => {
        if (customerCart) {
            setProductToCartMutation.mutate({
                cartId: customerCart.id,
                productId: product.id,
                quantity: alteredQuantity,
            });
        }
    };

    const setProductToCartMutation = useMutation({
        mutationFn: setProductToCartAPI,
        onSuccess(data, variables, context) {
            dispatch(
                setCart({
                    cart: data.cart,
                })
            );
        },
        onError(error, variables, context) {
            toast(_.get(error, 'message', 'Something went wrong.'));
            setQuantity(cartData.quantity);
        },
    });

    useEffect(() => {
        if (customerCart) {
            const productInCart = customerCart.cartData.find(
                (el) => el.productId === product.id
            );

            if (productInCart) {
                setCurrentProduct({
                    ...product,
                });
                setQuantity(productInCart.quantity);
            }
        }
    }, [product, customerCart]);

    useEffect(() => {
        const loadImage = setTimeout(() => {
            setIsImageLoading(false);
        }, 2000);

        return () => clearTimeout(loadImage);
    }, []);

    useEffect(() => {
        const changeQuantityTimeout = setTimeout(() => {
            if (changeInQuantity.current) {
                handleProductToCart();
            }
        }, 1000);

        return () => clearTimeout(changeQuantityTimeout);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quantity]);

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
                                handleRemoveFromCart();
                            }}
                        >
                            <RemoveIcon className="m-auto pointer-events-none w-4" />
                        </ButtonBase>

                        <InputBase
                            value={quantity}
                            onChange={handleChangeItemsInCart}
                            className="w-12 h-11"
                            inputProps={{
                                className: 'text-center h-full w-full p-0',
                            }}
                        />

                        <ButtonBase
                            className="w-11 h-11 flex cursor-pointer"
                            onClick={() => {
                                handleAddMoreToCart();
                            }}
                        >
                            <AddIcon className="m-auto pointer-events-none w-4" />
                        </ButtonBase>
                    </Box>

                    <Box className="flex items-center justify-center ml-4 cursor-pointer">
                        <DeleteOutlineOutlinedIcon
                            onClick={() => {
                                handleProductToCart(0);
                            }}
                        />
                    </Box>
                </Box>
            </td>

            <td className="text-right w-[150px]">
                <Box>
                    <Typography>
                        Rs. {cartData.quantity * +currentProduct.price}
                    </Typography>
                </Box>
            </td>
        </tr>
    ) : null;
};

export default Product;

interface IProps {
    product: CartGetCartProductApiResponse;
    cartData: cartData;
}

const setProductToCartAPI = async (body: {
    cartId: string;
    productId: string;
    quantity: number;
}) => {
    const data: CartSetProductToCartApiResponse = await axiosInstance.post(
        `${env.baseURL}/api/cart/set-product-to-cart`,
        body
    );
    return data;
};
