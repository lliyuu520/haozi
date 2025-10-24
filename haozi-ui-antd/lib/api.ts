import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { getToken, removeToken } from './auth';

// API 响应数据类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
  success: boolean;
}

// 分页响应数据类型
export interface PageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加认证token
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['satoken'] = token;
    }

    // 添加请求时间戳
    config.params = {
      ...config.params,
      _t: Date.now(),
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    // 如果是下载文件等二进制数据，直接返回
    if (response.config.responseType === 'blob') {
      return response;
    }

    // 业务成功
    if (data.success || data.code === 200) {
      return response;
    }

    // 业务失败
    message.error(data.msg || '请求失败');
    return Promise.reject(new Error(data.msg || '请求失败'));
  },
  (error) => {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录');
          removeToken();
          // 跳转到登录页面
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问该资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(data?.msg || `请求失败: ${status}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      message.error('请求超时，请重试');
    } else {
      message.error('网络异常，请检查网络连接');
    }

    return Promise.reject(error);
  }
);

// 通用请求方法
export const request = {
  get<T = any>(url: string, params?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return service.get(url, { params });
  },

  post<T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return service.post(url, data);
  },

  put<T = any>(url: string, data?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return service.put(url, data);
  },

  delete<T = any>(url: string, params?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return service.delete(url, { params });
  },

  upload<T = any>(url: string, formData: FormData): Promise<AxiosResponse<ApiResponse<T>>> {
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  download(url: string, params?: any): Promise<AxiosResponse> {
    return service.get(url, {
      params,
      responseType: 'blob',
    });
  },
};

export default service;