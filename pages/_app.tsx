import AppWrapper from '@/HOC/AppWrapper';
import store from '@/redux/store';
import theme from '@/styles/theme';
import createEmotionCache from '@/utils/createEmotionCache';
import { CacheProvider, type EmotionCache } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

const clientSideEmotionCache = createEmotionCache();

const App = ({
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { ...pageProps },
}: CustomAppProps) => {
    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <CssBaseline />
                    <AppWrapper>
                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />

                        <main className="p-4 pt-20 h-full min-h-screen">
                            <Component {...pageProps} />
                        </main>
                    </AppWrapper>
                </Provider>
            </ThemeProvider>
        </CacheProvider>
    );
};

export default App;

export interface CustomAppProps extends AppProps<{}> {
    emotionCache: EmotionCache;
}
