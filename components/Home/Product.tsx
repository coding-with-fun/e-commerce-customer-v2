import Modal from '@/HOC/Modal';
import { useAppDispatch } from '@/hooks/redux';
import axiosInstance from '@/libs/interceptor';
import toast from '@/libs/toast';
import { toggleFavoriteProduct } from '@/redux/slice/products.slice';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import {
    Box,
    CircularProgress,
    Paper,
    Rating,
    Skeleton,
    Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import SignInAlert from './SignInAlert';
import {
    ProductListApiResponse,
    ProductListProduct,
} from '@/pages/api/product/list';
import HomeProductType from '@/types/homeProduct';

const Product = ({ product }: IProps) => {
    const { push } = useRouter();
    const { status } = useSession();
    const dispatch = useAppDispatch();

    const productSlug = product.title.split(' ').join('-') + `-${product.id}`;

    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isSignInAlertOpen, setIsSignInAlertOpen] = useState(false);
    const [cleanSignInAlertContent, setCleanSignInAlertContent] =
        useState(false);

    const handleCloseSignInAlert = () => {
        setIsSignInAlertOpen(false);
    };

    const handleOpenSignInAlert = () => {
        setIsSignInAlertOpen(true);
    };

    useEffect(() => {
        const loadImage = setTimeout(() => {
            setIsImageLoading(false);
        }, 2000);

        return () => clearTimeout(loadImage);
    }, []);

    return (
        <Fragment>
            <Paper
                elevation={0}
                variant="outlined"
                sx={{
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    minHeight: '266px',
                    minWidth: '337px',
                    userSelect: 'none',
                    position: 'relative',
                }}
            >
                {/* {isMutating ? (
                    <Box
                        sx={{
                            position: 'absolute',
                            bgcolor: '#28282B',
                            opacity: '30%',
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: '999',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : null} */}

                <Box className="relative h-40">
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

                <Box className="flex items-start mt-4 gap-4">
                    <Box className="flex flex-col">
                        <Link href={`product/${productSlug}`}>
                            <Typography className="product-title font-medium hover:underline">
                                {product.title}
                            </Typography>
                        </Link>

                        {product.seller ? (
                            <Typography
                                variant="body2"
                                className="mt-1 mb-4 text-gray-600 font-light"
                            >
                                by {product.seller.name}
                            </Typography>
                        ) : null}
                    </Box>

                    <Box
                        className="mt-1 text-red-600 flex justify-center items-center cursor-pointer"
                        onClick={() => {
                            if (status === 'unauthenticated') {
                                handleOpenSignInAlert();
                            } else {
                                // trigger({
                                //     id: product.id,
                                // });
                            }
                        }}
                    >
                        {product.isFavorite ? (
                            <FavoriteOutlinedIcon />
                        ) : (
                            <FavoriteBorderOutlinedIcon />
                        )}
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography className="font-medium">
                        Rs. {`${product.price}`}
                    </Typography>

                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                        }}
                    >
                        <Rating
                            name="product-rating"
                            value={product.averageRating}
                            precision={0.5}
                            readOnly
                        />

                        <Typography
                            sx={{
                                fontSize: '0.8rem',
                            }}
                        >
                            {product.totalRatings}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Modal
                handleCloseModal={handleCloseSignInAlert}
                open={isSignInAlertOpen}
                setCleanModalContent={setCleanSignInAlertContent}
            >
                {cleanSignInAlertContent ? null : <SignInAlert />}
            </Modal>
        </Fragment>
    );
};

export default Product;

interface IProps {
    product: HomeProductType;
}

const fetcher = async (
    url: string,
    {
        arg,
    }: {
        arg: {
            id: number;
        };
    }
) => {
    const response = await axiosInstance.post(url, {
        id: arg.id,
    });
    return response;
};
