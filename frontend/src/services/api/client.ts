import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from './types';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - attach token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(
          import.meta.env.VITE_TOKEN_STORAGE_KEY || 'access_token'
        );
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequest;

        // Handle 401 Unauthorized - attempt token refresh
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Wait for token refresh
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem(
              import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token'
            );

            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const response = await this.client.post<TokenResponse>(
              '/api/v1/auth/refresh',
              { refresh_token: refreshToken }
            );

            const { access_token, refresh_token } = response.data;

            localStorage.setItem(
              import.meta.env.VITE_TOKEN_STORAGE_KEY || 'access_token',
              access_token
            );
            localStorage.setItem(
              import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token',
              refresh_token
            );

            // Notify subscribers
            this.refreshSubscribers.forEach((callback) => callback(access_token));
            this.refreshSubscribers = [];

            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Clear tokens and redirect to login
            localStorage.removeItem(import.meta.env.VITE_TOKEN_STORAGE_KEY || 'access_token');
            localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token');
            localStorage.removeItem(import.meta.env.VITE_USER_STORAGE_KEY || 'user');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Transform error to standard format
        return Promise.reject(this.transformError(error));
      }
    );
  }

  private transformError(error: AxiosError): ApiError {
    const responseData = error.response?.data as Record<string, unknown> | undefined;

    // Handle FastAPI error format (detail field)
    if (responseData?.detail) {
      return {
        code: `HTTP_${error.response?.status || 'UNKNOWN'}`,
        message: typeof responseData.detail === 'string'
          ? responseData.detail
          : JSON.stringify(responseData.detail),
        details: responseData,
      };
    }

    // Handle standard error format
    const errorObj = responseData?.error as Record<string, unknown> | undefined;
    return {
      code: (errorObj?.code as string) || `HTTP_${error.response?.status || 'UNKNOWN'}`,
      message: (errorObj?.message as string) || error.message || 'An error occurred',
      details: errorObj?.details as Record<string, unknown> | undefined,
    };
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  // File upload with progress tracking
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    additionalData?: Record<string, string>
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
