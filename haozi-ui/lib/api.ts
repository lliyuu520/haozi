import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { getToken, removeToken } from './auth';
import { API_CONFIG } from './apiEndpoints';

export interface ApiResponse<T = unknown> {
  code?: number;
  data: T;
  msg?: string;
  success?: boolean;
}



const service: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    config.params = {
      ...config.params,
      _t: Date.now(),
    };

    return config;
  },
  error => Promise.reject(error),
);

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    if (response.config.responseType === 'blob') {
      return response;
    }

    const isSuccess =
      data.success === true ||
      (typeof data.success === 'undefined' &&
        typeof data.code === 'number' &&
        (data.code === 0 || data.code === 200));

    if (isSuccess) {
      return response;
    }

    message.error(data.msg || 'Request failed');
    return Promise.reject(new Error(data.msg || 'Request failed'));
  },
  error => {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      switch (status) {
        case 401: {
          message.error('Session expired, please sign in again');
          removeToken();
          window.location.href = '/login';
          break;
        }
        case 403:
          message.error('Insufficient permissions');
          break;
        case 404:
          message.error('Resource not found');
          break;
        case 500:
          message.error('Internal server error');
          break;
        default:
          message.error(data?.msg || `Request failed: ${status}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      message.error('Request timed out, please retry');
    } else {
      message.error('Network error, please check your connection');
    }

    return Promise.reject(error);
  },
);

export const request = {
  get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<
    AxiosResponse<ApiResponse<T>>
  > {
    return service.get<ApiResponse<T>>(url, { params });
  },

  post<T = unknown>(url: string, data?: unknown): Promise<AxiosResponse<ApiResponse<T>>> {
    return service.post<ApiResponse<T>>(url, data);
  },

  put<T = unknown>(url: string, data?: unknown): Promise<AxiosResponse<ApiResponse<T>>> {
    return service.put<ApiResponse<T>>(url, data);
  },

  delete<T = unknown>(url: string, params?: Record<string, unknown>): Promise<
    AxiosResponse<ApiResponse<T>>
  > {
    return service.delete<ApiResponse<T>>(url, { params });
  },

  upload<T = unknown>(url: string, formData: FormData): Promise<
    AxiosResponse<ApiResponse<T>>
  > {
    return service.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  download(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<Blob>> {
    return service.get<Blob>(url, {
      params,
      responseType: 'blob',
    });
  },
};
export default service;
