import { create } from 'zustand';
import type { AuthorizationPayload, CurrentUser } from '@/types/auth';

type AuthState = {
  initialized: boolean;
  user: CurrentUser | null;
  routeCodes: string[];
  permissions: string[];
  setInitialized: (initialized: boolean) => void;
  setCurrentUser: (user: CurrentUser | null) => void;
  setAuthorizations: (payload: AuthorizationPayload) => void;
  clear: () => void;
};

/**
 * 登录用户状态。
 *
 * 只保存浏览器运行期需要的用户上下文，不保存 Sa-Token token 值，避免前端可读 token 成为新架构包袱。
 */
export const useAuthStore = create<AuthState>(set => ({
  initialized: false,
  user: null,
  routeCodes: [],
  permissions: [],
  setInitialized: initialized => set({ initialized }),
  setCurrentUser: user =>
    set({
      user,
      routeCodes: user?.routeCodes ?? [],
      permissions: user?.permissions ?? [],
      initialized: true,
    }),
  setAuthorizations: payload =>
    set({
      routeCodes: payload.routeCodes,
      permissions: payload.permissions,
    }),
  clear: () =>
    set({
      initialized: true,
      user: null,
      routeCodes: [],
      permissions: [],
    }),
}));
