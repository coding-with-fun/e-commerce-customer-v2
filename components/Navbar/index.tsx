import { useAppSelector } from '@/hooks/redux';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import {
    Avatar,
    Badge,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Skeleton,
    Tooltip,
    Typography,
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useMemo, useState } from 'react';
import Logo from '../../public/assets/logo/logo-no-background.svg';
import Button from './Button';

const Navbar = () => {
    const { status, data: session } = useSession();
    const { customerCart } = useAppSelector((state) => state.cart);

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const totalCartQuantity = useMemo(() => {
        if (!customerCart) {
            return 0;
        }

        return customerCart.cartData.reduce(
            (prev, current) => prev + current.quantity,
            0
        );
    }, [customerCart]);

    return (
        <Box className="h-16 fixed top-0 right-0 left-0 shadow-md flex items-center justify-between px-8 z-50 bg-[#f6f6f6]">
            <Link href="/">
                <Image height={25} src={Logo} alt="Avira" />
            </Link>

            <Box className="flex gap-4 items-center">
                {status === 'loading' ? (
                    <Skeleton width={220} height={25} />
                ) : (
                    <Fragment>
                        <Link href="/cart" className="mr-3">
                            <Badge
                                badgeContent={totalCartQuantity}
                                className="cart-badge"
                            >
                                <ShoppingBagOutlinedIcon
                                    sx={{
                                        color: '#131415',
                                        cursor: 'pointer',
                                    }}
                                />
                            </Badge>
                        </Link>

                        {status === 'unauthenticated' ? (
                            <Link href="/auth/signin">
                                <Button type="outlined">Sign In</Button>
                            </Link>
                        ) : null}

                        {status === 'unauthenticated' ? (
                            <Link href="/auth/signup">
                                <Button>Sign Up</Button>
                            </Link>
                        ) : null}

                        {status === 'authenticated' ? (
                            <Fragment>
                                <Tooltip title="Open settings">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{
                                            p: 0,
                                        }}
                                    >
                                        <Avatar
                                            alt={session.customer.name}
                                            src={
                                                session.customer.profilePicture
                                            }
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{
                                        mt: '45px',
                                    }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography
                                            textAlign="center"
                                            onClick={() => {
                                                signOut({
                                                    redirect: false,
                                                });
                                            }}
                                        >
                                            Sign Out
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </Fragment>
                        ) : null}
                    </Fragment>
                )}
            </Box>
        </Box>
    );
};

export default Navbar;
