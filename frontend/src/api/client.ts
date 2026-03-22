import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/store/auth';
import type { ApiError } from '@/types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      useAuthStore.getState().clearToken();
      if (
        globalThis.location !== undefined &&
        globalThis.location.pathname !== '/login'
      ) {
        globalThis.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export function getApiError(error: unknown): ApiError | null {
  if (error instanceof AxiosError && error.response?.data) {
    return error.response.data as ApiError;
  }
  return null;
}

export default apiClient;
