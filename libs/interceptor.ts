import env from '@/utils/env';
import axios from 'axios';
import _ from 'lodash';
import { signOut } from 'next-auth/react';

export const baseURL = env.baseURL;

const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
    function (config) {
        // Do something before request is sent

        // Set customer token if available in local storage

        config.headers['Content-Type'] = 'application/json';
        config.headers.Accept = 'application/json';

        return config;
    },
    async function (error) {
        // Do something with request error
        return await Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data

        if (_.get(response, 'data.success') === false) {
            return Promise.reject(response.data);
        }

        return response.data;
    },
    async function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response

        console.log(error);

        if (error.response.status === 401) {
            console.log('TRIGGER SIGN OUT');

            signOut({
                redirect: false,
            });
        }
        return await Promise.reject(error.response.data);
    }
);

export default axiosInstance;
