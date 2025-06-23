import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            const currentAccessToken = localStorage.getItem('accessToken');

            if (refreshToken && currentAccessToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refreshtoken`, {
                        accessToken: currentAccessToken, 
                        refreshToken,
                    });

                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

                    localStorage.setItem('accessToken', newAccessToken);
                    if (newRefreshToken) { 
                        localStorage.setItem('refreshToken', newRefreshToken);
                    }


                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Refresh token failed:', refreshError);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    return Promise.reject(refreshError);
                }
            } else {
                console.error('No refresh token available');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;