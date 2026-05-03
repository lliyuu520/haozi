import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import type { ResultEnvelope, ApiError } from '@/src/types/api';

// ─── 自定义错误类 ────────────────────────────────────────────

/** 业务逻辑错误：后端 Result.code != 0 */
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

/** 接口契约错误：响应体不符合 ResultEnvelope 格式 */
export class ApiContractError extends Error {
    response: unknown;

    constructor(response: unknown) {
        super('接口响应格式不正确');
        this.name = 'ApiContractError';
        this.response = response;
    }
}

// ─── SecureStore token 常量 ──────────────────────────────────

const TOKEN_KEY = 'token';

// ─── Axios 实例 ──────────────────────────────────────────────

const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 30_000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

// ─── 请求拦截器：注入 Authorization ─────────────────────────

instance.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = token;
        }
    } catch {
        // SecureStore 读取失败时静默跳过，不阻塞请求
    }
    return config;
});

// ─── 响应拦截器：解包 ResultEnvelope ─────────────────────────

instance.interceptors.response.use(
    (response) => {
        const body = response.data;

        // 检查是否为标准 ResultEnvelope 格式
        if (!isResultEnvelope(body)) {
            return Promise.reject(new ApiContractError(body));
        }

        // code == 0 为成功，返回 data 部分
        if (Number(body.code) === 0) {
            return body.data as any;
        }

        // 业务错误
        return Promise.reject(new BusinessError(body));
    },
    async (error: AxiosError<ApiError>) => {
        const status = error.response?.status;
        const data = error.response?.data;
        const text = getResponseMessage(data) || error.message || '请求失败';

        if (status === 401) {
            // 清除本地 token
            try {
                await SecureStore.deleteItemAsync(TOKEN_KEY);
            } catch {
                // 忽略删除失败
            }

            // 延迟导入避免循环依赖；authStore 由后续任务创建
            try {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const storePath = '@/src/store/authStore';
                const mod = await (import(/* webpackIgnore: true */ storePath) as Promise<{ useAuthStore: { getState: () => { clear: () => void } } }>);
                mod.useAuthStore.getState().clear();
            } catch {
                // authStore 尚未创建时静默跳过
            }

            // 跳转登录页
            router.replace('/login' as any);
        } else if (status === 403) {
            Alert.alert('权限不足', '没有访问权限');
        } else if (status && status >= 500) {
            Alert.alert('请求失败', '服务器异常，请稍后再试');
        } else if (text) {
            Alert.alert('请求失败', text);
        }

        return Promise.reject(error);
    },
);

// ─── 类型安全请求门面 ───────────────────────────────────────

/**
 * 统一请求门面，与响应拦截器语义一致。
 *
 * 返回值已经过 ResultEnvelope 解包，业务调用方直接获得 data 部分的类型。
 */
export const api = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        instance.get<T, T>(url, config),

    post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
        instance.post<T, T, D>(url, data, config),

    put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
        instance.put<T, T, D>(url, data, config),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        instance.delete<T, T>(url, config),
};

// ─── 工具函数 ────────────────────────────────────────────────

/** 判断响应体是否为 ResultEnvelope 格式 */
function isResultEnvelope(value: unknown): value is ResultEnvelope<unknown> {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const body = value as Record<string, unknown>;
    return 'code' in body && ('msg' in body || 'message' in body);
}

/** 从错误响应体中提取可读消息 */
function getResponseMessage(value: unknown): string {
    if (!value || typeof value !== 'object') {
        return '';
    }
    const body = value as Record<string, unknown>;
    const message = body.message || body.msg;
    return typeof message === 'string' ? message : '';
}
