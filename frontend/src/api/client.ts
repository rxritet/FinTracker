import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiError } from '@/types';

// ── Storage key ───────────────────────────────────────────────────────────────
const TOKEN_KEY = 'ft_access_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => { localStorage.setItem(TOKEN_KEY, token); },
  clear: (): void => { localStorage.removeItem(TOKEN_KEY); },
};

// ── Axios instance ────────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});

// ── Request interceptor — attach Bearer token ─────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ── Response interceptor — handle 401 ────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      tokenStorage.clear();
      // Hard redirect so the router state is fully reset.
      // Replace with a custom event / zustand action when auth store is ready.
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// ── Typed error helper ────────────────────────────────────────────────────────

/** Returns the structured ApiError body if the error is an Axios 4xx/5xx, otherwise null. */
export function getApiError(error: unknown): ApiError | null {
  if (error instanceof AxiosError && error.response?.data) {
    return error.response.data as ApiError;
  }
  return null;
}

export default apiClient;
