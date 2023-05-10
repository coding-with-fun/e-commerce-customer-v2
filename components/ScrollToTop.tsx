import RocketIcon from '@mui/icons-material/Rocket';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

const ScrollToTop = () => {
    const [showButton, setShowButton] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const handleScrollButtonVisibility = () => {
            setShowButton(scrollY > 200);
        };

        window.addEventListener('scroll', handleScrollButtonVisibility);

        return () => {
            window.removeEventListener('scroll', handleScrollButtonVisibility);
        };
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: '0.5rem',
                right: '0.5rem',
                zIndex: 9,
                cursor: 'pointer',
                padding: '1rem',
                borderRadius: '50%',
                backgroundColor: '#ff1f0c',
                color: '#ffffff',
                display: 'flex',
                opacity: showButton ? '1' : '0',
                transition:
                    'opacity .2s ease-in-out, visibility .2s ease-in-out',
                visibility: showButton ? 'visible' : 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onClick={() => scrollToTop()}
        >
            <RocketIcon />
        </Box>
    );
};

export default ScrollToTop;
