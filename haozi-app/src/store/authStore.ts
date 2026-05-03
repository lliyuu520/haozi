import { create } from 'zustand';
import type { AuthorizationPayload, CurrentUser } from '@/src/types/auth';
import { getToken, removeToken } from '@/src/utils/token';

type AuthState = {
    /** 应用是否已完成初始化（尝试恢复会话） */
    initialized: boolean;
    /** 当前登录用户 */
    user: CurrentUser | null;
    /** 可访问的路由编码 */
    routeCodes: string[];
    /** 权限编码 */
    permissions: string[];

    /** 设置当前用户，同时提取 routeCodes 和 permissions */
    setCurrentUser: (user: CurrentUser) => void;
    /** 更新路由码和权限码 */
    setAuthorizations: (payload: AuthorizationPayload) => void;
    /** 清除所有状态并删除 SecureStore 中的 token */
    clear: () => void;
    /** 初始化：从 SecureStore 恢复 token，尝试调用 /auth/me 恢复会话 */
    initialize: () => Promise<void>;
};

/**
 * 认证状态管理。
 *
 * 保存当前登录用户、路由权限和按钮权限。
 * token 存储在 SecureStore 中，不在内存状态里暴露。
 */
export const useAuthStore = create<AuthState>((set) => ({
    initialized: false,
    user: null,
    routeCodes: [],
    permissions: [],

    setCurrentUser: (user) =>
        set({
            user,
            routeCodes: user.routeCodes ?? [],
            permissions: user.permissions ?? [],
            initialized: true,
        }),

    setAuthorizations: (payload) =>
        set({
            routeCodes: payload.routeCodes,
            permissions: payload.permissions,
        }),

    clear: () => {
        // 异步清除 SecureStore，不阻塞状态重置
        removeToken().catch(() => {});
        set({
            initialized: true,
            user: null,
            routeCodes: [],
            permissions: [],
        });
    },

    initialize: async () => {
        try {
            const token = await getToken();
            if (!token) {
                set({ initialized: true });
                return;
            }

            // 延迟导入 api 避免循环依赖（request.ts 可能反向引用 authStore）
            const { api } = await import('@/src/api/request');
            const user = await api.get<CurrentUser>('/auth/me');

            set({
                user,
                routeCodes: user.routeCodes ?? [],
                permissions: user.permissions ?? [],
                initialized: true,
            });
        } catch {
            // 恢复失败（token 过期等），清除 token 并标记初始化完成
            await removeToken().catch(() => {});
            set({ initialized: true });
        }
    },
}));
