import { Box, ButtonBase, Typography } from '@mui/material';
import React from 'react';
import style from './Button.module.css';

const Button = ({ children, type }: IProps) => {
    return (
        <ButtonBase
            className={`px-5 py-1 ${style.buttonBase} ${
                type === 'outlined' ? style.outlinedButton : style.blockButton
            }`}
        >
            {children}
        </ButtonBase>
    );
};

export default Button;

interface IProps {
    children: string;
    type?: 'outlined' | 'block';
}
