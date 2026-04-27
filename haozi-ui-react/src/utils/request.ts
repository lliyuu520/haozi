import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { useAuthStore } from '@/store/authStore';

export type ApiError = {
  code: string;
  message: string;
  path: string;
  timestamp: string;
  traceId?: string | null;
  details?: Record<string, string>;
};

/**
 * React 前端统一请求实例。
 *
 * 新后端通过 HTTP 状态码表达错误，成功响应直接返回业务数据；Sa-Token 会话通过 Cookie 传递。
 */
export const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

request.interceptors.response.use(
  response => response.data,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const text = data?.message || error.message || '请求失败';

    if (status === 401) {
      useAuthStore.getState().clear();
      if (location.pathname !== '/login') {
        location.assign('/login');
      }
    } else if (status === 403) {
      message.error('没有访问权限');
    } else if (status === 409) {
      message.warning(text);
    } else if (status && status >= 500) {
      message.error('服务器异常，请稍后再试');
    } else if (text) {
      message.error(text);
    }

    return Promise.reject(error);
  },
);

/**
 * 与响应拦截器语义一致的类型安全请求门面。
 *
 * Axios 原始类型会认为返回值仍是 AxiosResponse；业务代码统一使用该对象获得解包后的业务数据类型。
 */
export const api = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return request.get<T, T>(url, config);
  },
  post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return request.post<T, T, D>(url, data, config);
  },
  put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return request.put<T, T, D>(url, data, config);
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return request.delete<T, T>(url, config);
  },
};
