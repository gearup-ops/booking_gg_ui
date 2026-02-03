import axios, { AxiosRequestConfig } from 'axios';
import { getLocaleStorage, removeFromLocalStorage } from '../utils';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
export const fetchStatic = process.env.NEXT_PUBLIC_APP_BACKEND ? process.env.NEXT_PUBLIC_APP_BACKEND : 'http://localhost:3001';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = getLocaleStorage('token');
        if (token) {
            // config.headers = {
            //     //  ...(config.headers || {}),
            //     // Authorization: `Bearer ${token}`,
            // };
            config.headers = config.headers || {};
            (config.headers as any).Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeFromLocalStorage('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/**
 * Wrapper function to allow per-request custom headers
 */
export const apiRequest = async <T = any>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    options?: AxiosRequestConfig
): Promise<T> => {
    const response = await apiClient.request<T>({
        method,
        url,
        data,
        ...options,
    });
    return response.data;
};
