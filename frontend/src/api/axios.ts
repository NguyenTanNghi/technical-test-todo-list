import axios from 'axios';
import type {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach auth token
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor — handle global errors
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<{ message?: string }>) => {
        const status = error.response?.status;

        if (status === 401) {
            // Token expired or invalid — clear storage and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/signin';
        }

        if (status === 403) {
            console.error('Forbidden: You do not have permission to access this resource.');
        }

        if (status && status >= 500) {
            console.error('Server error. Please try again later.');
        }

        const message =
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred.';

        return Promise.reject(new Error(message));
    }
);

export default axiosInstance;
