import { Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/assets/logo/logo-no-background.svg';

const Navbar = () => {
    return (
        <Box className="h-16 absolute top-0 right-0 left-0 shadow-sm flex items-center justify-between px-8 z-50">
            <Link href="/">
                <Image height={25} src={Logo} alt="Avira" />
            </Link>
        </Box>
    );
};

export default Navbar;
