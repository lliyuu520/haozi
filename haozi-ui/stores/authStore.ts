import { create } from 'zustand';
import {
  UserInfo,
  LoginParams,
  getToken as loadTokenFromStorage,
  getUserInfo as loadUserInfoFromStorage,
  setToken as persistToken,
  setUserInfo as persistUserInfo,
  clearAuth as clearStoredAuth,
  BackendLoginResponse,
} from '@/lib/auth';
import { request } from '@/lib/api';
import { useMenuStore } from '@/stores/menuStore';
import type { RawMenuNode } from '@/types/menu';
import {API} from "@/lib/apiEndpoints";

interface AuthState {
  // 全局状态
  token: string | null;
  userInfo: UserInfo | null;
  loading: boolean;

  // 操作
  login: (params: LoginParams) => Promise<boolean>;
  logout: () => void;
  updateUserInfo: (userInfo: Partial<UserInfo>) => void;
  checkAuth: () => boolean;
}

const COOKIE_NAME = 'haozi_token';
const REMEMBER_ME_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 天

const resolveInitialAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null, userInfo: null };
  }

  const token = loadTokenFromStorage();
  const userInfo = loadUserInfoFromStorage();

  return { token, userInfo };
};

const setAuthCookie = (token: string) => {
  if (typeof document === 'undefined') return;

  const maxAge =   REMEMBER_ME_COOKIE_MAX_AGE ;
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${maxAge}; sameSite=Lax`;
};

const clearAuthCookie = () => {
  if (typeof document === 'undefined') return;

  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; sameSite=Lax`;
};

const initialAuth = resolveInitialAuth();

export const useAuthStore = create<AuthState>((set, get) => ({
  // 初始状态
  token: initialAuth.token,
  userInfo: initialAuth.userInfo,
  loading: false,

  // 登录
  login: async (params: LoginParams) => {
    set({ loading: true });

    try {
      const response = await request.post<BackendLoginResponse>(API.auth.login(), params);
      const payload = response.data?.data;
      const token = payload?.accessToken;
      const sysUserCache = payload?.sysUserCache;
      const permissions = payload?.permissions ?? [];
      const menuTree = payload?.menuTree ?? [];

      if (!token || !sysUserCache) {
        set({ loading: false });
        return false;
      }

      // 转换后端数据为前端需要的格式
      const userInfo: UserInfo = {
        id: parseInt(sysUserCache.id, 10),
        username: sysUserCache.username,
        roleIdList: sysUserCache.roleIdList,
        permissions: permissions,
      };

      persistToken(token);
      setAuthCookie(token);
      persistUserInfo(userInfo);

      useMenuStore.getState().setMenus(menuTree);

      set({
        token,
        userInfo: userInfo,
        loading: false,
      });

      return true;
    } catch (error) {
      clearStoredAuth();
      clearAuthCookie();

      set({
        token: null,
        userInfo: null,
        loading: false,
      });

      throw error;
    }
  },

  // 退出登录
  logout: () => {
    clearStoredAuth();
    clearAuthCookie();

    set({
      token: null,
      userInfo: null,
    });
  },

  // 更新缓存的用户信息
  updateUserInfo: (newUserInfo: Partial<UserInfo>) => {
    const { userInfo } = get();

    if (userInfo) {
      const updatedUserInfo = { ...userInfo, ...newUserInfo };

      set({ userInfo: updatedUserInfo });
      persistUserInfo(updatedUserInfo);
    }
  },

  // 校验当前登录态
  checkAuth: () => {
    const { token, userInfo } = get();

    if (token && userInfo) {
      return true;
    }

    const storedToken = loadTokenFromStorage();
    const storedUserInfo = loadUserInfoFromStorage();

    if (storedToken && storedUserInfo) {
      setAuthCookie(storedToken);
      const menuStore = useMenuStore.getState();

      // 同时刷新菜单导航和权限
      void Promise.all([
        menuStore.fetchMenus().catch(() => undefined),
        menuStore.refreshAuthority().catch(() => undefined),
      ]).catch(() => undefined);

      set({
        token: storedToken,
        userInfo: storedUserInfo,
      });
      persistUserInfo(storedUserInfo);
      return true;
    }

    return false;
  },
}));





