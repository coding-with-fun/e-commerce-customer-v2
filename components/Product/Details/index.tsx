import Modal from '@/HOC/Modal';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import axiosInstance from '@/libs/interceptor';
import toast from '@/libs/toast';
import { CartSetProductToCartApiResponse } from '@/pages/api/cart/set-product-to-cart';
import { setCart } from '@/redux/slice/cart.slice';
import env from '@/utils/env';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveIcon from '@mui/icons-material/Remove';
import ShareIcon from '@mui/icons-material/Share';
import {
    Box,
    ButtonBase,
    CircularProgress,
    InputBase,
    Skeleton,
    Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import _ from 'lodash';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';

const Details = ({ product }: IProps) => {
    const { asPath } = useRouter();
    const session = useSession();
    const dispatch = useAppDispatch();
    const { customerCart } = useAppSelector((state) => state.cart);

    const [isImageLoading, setIsImageLoading] = useState(true);

    const [itemsToAddInCart, setItemsToAddInCart] = useState(1);
    const [isShareLinkAlertOpen, setIsShareLinkAlertOpen] = useState(false);
    const [cleanShareLinkAlertContent, setCleanShareLinkAlertContent] =
        useState(false);

    const setProductToCartMutation = useMutation({
        mutationFn: setProductToCartAPI,
        onSuccess(data, variables, context) {
            dispatch(
                setCart({
                    cart: data.cart,
                })
            );
            toast('Product added to cart successfully', 'success');
        },
        onError(error, variables, context) {
            toast(_.get(error, 'message', 'Something went wrong.'));
        },
    });

    const handleCloseShareLinkAlert = () => {
        setIsShareLinkAlertOpen(false);
    };

    const handleOpenShareLinkAlert = () => {
        setIsShareLinkAlertOpen(true);
    };

    const handleChangeItemsInCart = (e: ChangeEvent<HTMLInputElement>) => {
        let value: number | string = e.target.value;

        if (!isNaN(+value)) {
            value = +value;
            setItemsToAddInCart(value);
        }
    };

    const handleAddMoreToCart = () => {
        if (product.quantity > itemsToAddInCart) {
            setItemsToAddInCart((prev) => prev + 1);
        }
    };

    const handleRemoveFromCart = () => {
        if (itemsToAddInCart > 1) {
            setItemsToAddInCart((prev) => prev - 1);
        }
    };

    const handleProductToCart = () => {
        if (customerCart) {
            const cartProduct = customerCart.cartData.find(
                (el) => el.productId === product.id
            );
            setProductToCartMutation.mutate({
                cartId: customerCart.id,
                productId: product.id,
                quantity: cartProduct
                    ? cartProduct.quantity + itemsToAddInCart
                    : itemsToAddInCart,
            });
        }
    };

    useEffect(() => {
        const loadImage = setTimeout(() => {
            setIsImageLoading(false);
        }, 2000);

        return () => clearTimeout(loadImage);
    }, []);

    return (
        <Fragment>
            <Box className="flex flex-col gap-8 py-16 md:flex-row md:justify-center">
                <Box className="relative max-w-[470px] w-full mx-auto md:mx-0 md:flex-1 h-[250px] md:h-auto sm:h-[320px]">
                    <Image
                        priority
                        fill
                        quality={100}
                        src={product.coverImage}
                        alt={product.title}
                        sizes="160px"
                        style={{
                            objectFit: 'contain',
                            display: isImageLoading ? 'none' : 'block',
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

                <Box className="md:w-1/2">
                    <Typography className="text-sm">
                        {product.seller?.name}
                    </Typography>

                    <Typography
                        component="h1"
                        variant="h4"
                        className="product-title font-medium mb-6"
                    >
                        {product.title}
                    </Typography>

                    <Box>
                        <Typography className="text-lg">
                            Rs. {product.price}
                        </Typography>
                    </Box>

                    <Typography className="text-xs">
                        Taxes & India shipping included.
                    </Typography>

                    <Box className="my-10 max-w-[30rem]">
                        <Typography className="text-xs mb-1">
                            Quantity
                        </Typography>

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
                                value={itemsToAddInCart}
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

                        <ButtonBase
                            className="w-full h-12 flex justify-center items-center border border-[#28282B] border-solid cursor-pointer mt-3"
                            onClick={handleProductToCart}
                            disabled={setProductToCartMutation.isLoading}
                        >
                            {setProductToCartMutation.isLoading ? (
                                <CircularProgress
                                    className="text-[#131415]"
                                    size={20}
                                />
                            ) : (
                                <Typography>Add to cart</Typography>
                            )}
                        </ButtonBase>

                        {session.status === 'unauthenticated' ? (
                            <Box className="flex gap-[4px]">
                                <Typography className="text-xs">
                                    Please
                                </Typography>

                                <Typography
                                    onClick={() => {
                                        signIn(undefined, {
                                            callbackUrl: asPath,
                                        });
                                    }}
                                    className="cursor-pointer text-xs font-semibold underline"
                                >
                                    sign in
                                </Typography>

                                <Typography className="text-xs">
                                    to sync your cart across devices.
                                </Typography>
                            </Box>
                        ) : null}

                        <ButtonBase className="w-full h-12 flex justify-center items-center border border-[#28282B] border-solid bg-[#28282B] text-white cursor-pointer mt-4">
                            <Typography>Buy it now</Typography>
                        </ButtonBase>
                    </Box>

                    <Typography className="text-gray-600 font-light text-sm">
                        Item ships in 1-2 business days from our warehouse. Free
                        shipping all over India, delivers within 7-10 business
                        days.
                    </Typography>

                    <Box
                        className="flex items-center justify-start gap-2 mt-2 cursor-pointer w-fit hover:underline"
                        onClick={handleOpenShareLinkAlert}
                    >
                        <ShareIcon className="text-sm" />

                        <Typography className="text-sm">Share</Typography>
                    </Box>
                </Box>
            </Box>

            <Modal
                handleCloseModal={handleCloseShareLinkAlert}
                open={isShareLinkAlertOpen}
                setCleanModalContent={setCleanShareLinkAlertContent}
            >
                {cleanShareLinkAlertContent ? null : (
                    <ShareLinkAlert url={env.baseURL + asPath} />
                )}
            </Modal>
        </Fragment>
    );
};

export default Details;

interface IProps {
    product: any;
}

const ShareLinkAlert = ({ url }: { url: string }) => {
    return (
        <Box>
            <Typography className="text-lg mb-5">Share</Typography>

            <Box className="flex items-center bg-[#f9f9f9] border border-solid border-[rgba(0, 0, 0, 0.1)] rounded-lg pl-4">
                <InputBase
                    value={url}
                    fullWidth
                    inputProps={{
                        className: 'share-link text-sm',
                    }}
                />

                <ButtonBase
                    className="cursor-pointer py-2 p-4"
                    onClick={() => {
                        navigator.clipboard.writeText(url);
                        toast('Link copied to clipboard', 'success');
                    }}
                >
                    <ContentCopyIcon />
                </ButtonBase>
            </Box>
        </Box>
    );
};

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
