import { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material';

const themeOptions: ThemeOptions = {
    typography: {
        fontFamily: "'Poppins', sans-serif",
    },
};

const theme = createTheme(themeOptions);

export default theme;
