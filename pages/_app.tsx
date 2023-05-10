import AppWrapper from '@/HOC/AppWrapper';
import Navbar from '@/components/Navbar';
import store from '@/redux/store';
import theme from '@/styles/theme';
import createEmotionCache from '@/utils/createEmotionCache';
import { CacheProvider, type EmotionCache } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const App = ({
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps },
}: CustomAppProps) => {
    return (
        <SessionProvider session={session} refetchOnWindowFocus={false}>
            <CacheProvider value={emotionCache}>
                <ThemeProvider theme={theme}>
                    <Provider store={store}>
                        <QueryClientProvider client={queryClient}>
                            <CssBaseline />

                            <Navbar />

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
                        </QueryClientProvider>
                    </Provider>
                </ThemeProvider>
            </CacheProvider>
        </SessionProvider>
    );
};

export default App;

export interface CustomAppProps
    extends AppProps<{
        session: Session;
    }> {
    emotionCache: EmotionCache;
}
