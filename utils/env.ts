const env = {
    appName: process.env.NEXT_PUBLIC_APP_NAME as string,
    baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,

    auth: {
        secret: process.env.NEXT_AUTH_SECRET as string,
    },

    redux: {
        cartKey: process.env.NEXT_PUBLIC_REDUX_LOCAL_STORAGE_CART_KEY as string,
        cartId: process.env
            .NEXT_PUBLIC_REDUX_LOCAL_STORAGE_CART_ID_KEY as string,
    },

    stripe: {
        publishableKey: process.env
            .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
        secretKey: process.env.STRIPE_SECRET_KEY as string,
    },

    api: {
        countryAPI: process.env.NEXT_PUBLIC_COUNTRY_API_ENDPOINT as string,
    },
};

export default env;
