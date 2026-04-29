import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { MessageInstance } from 'antd/es/message/interface';
import { useAuthStore } from '@/store/authStore';

export type ApiError = {
  code: string;
  message: string;
  path: string;
  timestamp: string;
  traceId?: string | null;
  details?: Record<string, string>;
};

export type ResultEnvelope<T> = {
  code: number | string;
  message?: string;
  msg?: string;
  data?: T;
};

export class BusinessError extends Error {
  code: number | string;
  data: unknown;
  response: ResultEnvelope<unknown>;

  constructor(response: ResultEnvelope<unknown>) {
    const message = response.message || response.msg || '请求失败';
    super(message);
    this.name = 'BusinessError';
    this.code = response.code;
    this.data = response.data;
    this.response = response;
  }
}

export class ApiContractError extends Error {
  response: unknown;

  constructor(response: unknown) {
    super('接口响应格式不正确');
    this.name = 'ApiContractError';
    this.response = response;
  }
}

/**
 * 全局消息实例，由 AppProviders 在应用初始化时注入。
 *
 * 避免 axios 拦截器等非 React 上下文中使用静态 message API 导致 antd v6 弃用警告。
 */
let msg: MessageInstance | null = null;

export function setGlobalMessage(instance: MessageInstance) {
  msg = instance;
}

/**
 * React 前端统一请求实例。
 *
 * HTTP 状态码负责通道、认证、权限和系统级异常；业务成功与否统一由 Result.code 判断。
 * 拦截器只把 code 为 0 的 data 返回给业务调用方。
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
  response => {
    const body = response.data;
    if (!isResultEnvelope(body)) {
      const error = new ApiContractError(body);
      if (msg) {
        msg.error(error.message);
      }
      return Promise.reject(error);
    }
    if (Number(body.code) !== 0) {
      const error = new BusinessError(body);
      if (msg) {
        msg.error(error.message);
      }
      return Promise.reject(error);
    }
    return body.data as any;
  },
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const text = getResponseMessage(data) || error.message || '请求失败';

    if (status === 401) {
      useAuthStore.getState().clear();
      if (location.pathname !== '/login') {
        location.assign('/login');
      }
    } else if (msg) {
      if (status === 403) {
        msg.error('没有访问权限');
      } else if (status === 409) {
        msg.warning(text);
      } else if (status && status >= 500) {
        msg.error('服务器异常，请稍后再试');
      } else if (text) {
        msg.error(text);
      }
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

function isResultEnvelope(value: unknown): value is ResultEnvelope<unknown> {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const body = value as Record<string, unknown>;
  return 'code' in body && ('msg' in body || 'message' in body);
}

function getResponseMessage(value: unknown) {
  if (!value || typeof value !== 'object') {
    return '';
  }
  const body = value as Record<string, unknown>;
  const message = body.message || body.msg;
  return typeof message === 'string' ? message : '';
}
