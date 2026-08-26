import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data!;
        localStorage.setItem('accessToken', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<{ user: any; accessToken: string }>>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: any; accessToken: string }>>('/auth/login', data),
  
  refresh: () =>
    api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh'),
  
  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),
  
  getProfile: () =>
    api.get<ApiResponse<any>>('/auth/profile'),
};

export const categoriesApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<ApiResponse<any>>('/categories', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<any>>(`/categories/${id}`),
  
  getBySlug: (slug: string) =>
    api.get<ApiResponse<any>>(`/categories/slug/${slug}`),
  
  create: (data: { name: string; slug: string; description?: string }) =>
    api.post<ApiResponse<any>>('/categories', data),
  
  update: (id: string, data: { name?: string; slug?: string; description?: string }) =>
    api.patch<ApiResponse<any>>(`/categories/${id}`, data),
  
  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/categories/${id}`),
};

export const productsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
    inStock?: boolean;
  }) => api.get<ApiResponse<any>>('/products', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<any>>(`/products/${id}`),
  
  getByCategory: (slug: string, params?: any) =>
    api.get<ApiResponse<any>>(`/products/category/${slug}`, { params }),
  
  create: (data: {
    name: string;
    description?: string;
    price: number;
    stock?: number;
    images?: string[];
    categoryId: string;
  }) => api.post<ApiResponse<any>>('/products', data),
  
  update: (id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    images?: string[];
    categoryId?: string;
  }) => api.patch<ApiResponse<any>>(`/products/${id}`, data),
  
  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/products/${id}`),
};

export const ordersApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<ApiResponse<any>>('/orders', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<any>>(`/orders/${id}`),
  
  create: (data: { items: Array<{ productId: string; quantity: number }> }) =>
    api.post<ApiResponse<any>>('/orders', data),
  
  updateStatus: (id: string, status: string) =>
    api.patch<ApiResponse<any>>(`/orders/${id}/status`, { status }),
  
  cancel: (id: string) =>
    api.patch<ApiResponse<any>>(`/orders/${id}/cancel`),
};

export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<ApiResponse<any>>('/users', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<any>>(`/users/${id}`),
  
  update: (id: string, data: { name?: string; email?: string }) =>
    api.patch<ApiResponse<any>>(`/users/${id}`, data),
  
  changePassword: (id: string, data: { currentPassword: string; newPassword: string }) =>
    api.patch<ApiResponse<any>>(`/users/${id}/password`, data),
  
  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/users/${id}`),
};

export default api;