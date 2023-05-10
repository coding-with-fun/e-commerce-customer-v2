import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import MuiModal from '@mui/material/Modal';
import { useEffect } from 'react';

const Modal = (props: PropTypes): JSX.Element => {
    const { open, handleCloseModal, setCleanModalContent, children } = props;

    useEffect(() => {
        setCleanModalContent(false);

        return () => {
            setCleanModalContent(true);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MuiModal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleCloseModal}
            closeAfterTransition
            slots={{
                backdrop: Backdrop,
            }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: '#fff',
                        boxShadow: 24,
                        border: 'transparent',
                        outline: '0',
                        p: 4,
                        borderRadius: '5px',
                    }}
                >
                    {children}
                </Box>
            </Fade>
        </MuiModal>
    );
};

export default Modal;

interface PropTypes {
    open: boolean;
    handleCloseModal: () => void;
    setCleanModalContent: React.Dispatch<React.SetStateAction<boolean>>;
    children: JSX.Element[] | JSX.Element | null;
}
