import { toast as reactToast, type Id } from 'react-toastify';

const toast = (
    message: string,
    type: 'info' | 'success' | 'error' | 'warn' = 'error'
): Id => {
    return reactToast[type](message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
    });
};

export default toast;
