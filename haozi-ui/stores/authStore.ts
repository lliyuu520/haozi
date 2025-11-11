import { create } from 'zustand';
import {
  UserInfo,
  LoginParams,
  LoginResponse,
  getToken as loadTokenFromStorage,
  getUserInfo as loadUserInfoFromStorage,
  setToken as persistToken,
  setUserInfo as persistUserInfo,
  getAuthorities as loadAuthoritiesFromStorage,
  setAuthorities as persistAuthorities,
  clearAuth as clearStoredAuth,
} from '@/lib/auth';
import { request } from '@/lib/api';
import { useMenuStore } from '@/stores/menuStore';
import type { RawMenuNode } from '@/types/menu';
import {API} from "@/lib/apiEndpoints";

interface AuthState {
  // State
  token: string | null;
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  loading: boolean;
  authorities: string[];

  // Actions
  login: (params: LoginParams) => Promise<boolean>;
  logout: () => void;
  updateUserInfo: (userInfo: Partial<UserInfo>) => void;
  checkAuth: () => boolean;
  setAuthorities: (authorities: string[]) => void;
}

const COOKIE_NAME = 'haozi_token';
const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours
const REMEMBER_ME_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const resolveInitialAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null, userInfo: null, authorities: [] };
  }

  const token = loadTokenFromStorage();
  const userInfo = loadUserInfoFromStorage();
  const authorities = loadAuthoritiesFromStorage();

  return { token, userInfo, authorities };
};

const setAuthCookie = (token: string, rememberMe?: boolean) => {
  if (typeof document === 'undefined') return;

  const maxAge = rememberMe ? REMEMBER_ME_COOKIE_MAX_AGE : DEFAULT_COOKIE_MAX_AGE;
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${maxAge}; sameSite=Lax`;
};

const clearAuthCookie = () => {
  if (typeof document === 'undefined') return;

  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; sameSite=Lax`;
};

const initialAuth = resolveInitialAuth();

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  token: initialAuth.token,
  userInfo: initialAuth.userInfo,
  isLoggedIn: Boolean(initialAuth.token && initialAuth.userInfo),
  loading: false,
  authorities: initialAuth.authorities ?? [],

  // Login
  login: async (params: LoginParams) => {
    set({ loading: true });

    try {
      const response = await request.post<LoginResponse>(API.auth.login(), params);
      const payload = response.data?.data;
      const token = payload?.token ?? payload?.accessToken;

      if (!token) {
        set({ loading: false });
        return false;
      }

      persistToken(token);
      setAuthCookie(token, params.rememberMe);

      let userInfo = payload?.userInfo ?? null;

      if (!userInfo) {
        const userInfoResponse = await request.get<UserInfo>(API.user.info());
        userInfo = userInfoResponse.data?.data ?? null;
      }

      if (!userInfo) {
        throw new Error('Unable to load user profile, please contact the administrator.');
      }

      const [menuResponse, authorityResponse] = await Promise.all([
        request.get<RawMenuNode[]>(API.menu.navigation.list()),
        request.get<string[]>(API.menu.navigation.authority()),
      ]);

      const menus = Array.isArray(menuResponse.data?.data)
        ? (menuResponse.data.data as RawMenuNode[])
        : [];
      const authorities = Array.isArray(authorityResponse.data?.data)
        ? authorityResponse.data.data.filter((item): item is string => false)
        : [];

      const userInfoWithPermissions: UserInfo = {
        ...userInfo,
        permissions: authorities.length > 0 ? authorities : userInfo.permissions ?? [],
      };

      persistUserInfo(userInfoWithPermissions);
      persistAuthorities(authorities);

      useMenuStore.getState().setMenus(menus);

      set({
        token,
        userInfo: userInfoWithPermissions,
        isLoggedIn: true,
        loading: false,
        authorities,
      });

      return true;
    } catch (error) {
      clearStoredAuth();
      clearAuthCookie();

      set({
        token: null,
        userInfo: null,
        isLoggedIn: false,
        loading: false,
        authorities: [],
      });

      throw error;
    }
  },

  // Logout
  logout: () => {
    clearStoredAuth();
    clearAuthCookie();

    set({
      token: null,
      userInfo: null,
      isLoggedIn: false,
      authorities: [],
    });
  },

  // Update cached user info
  updateUserInfo: (newUserInfo: Partial<UserInfo>) => {
    const { userInfo, authorities } = get();

    if (userInfo) {
      const updatedUserInfo = { ...userInfo, ...newUserInfo };
      const nextAuthorities = Array.isArray(updatedUserInfo.permissions)
        ? updatedUserInfo.permissions
        : authorities;

      set({ userInfo: updatedUserInfo, authorities: nextAuthorities });
      persistUserInfo(updatedUserInfo);
      persistAuthorities(nextAuthorities);
    }
  },

  // Check authentication state
  checkAuth: () => {
    const { token, userInfo } = get();

    if (token && userInfo) {
      return true;
    }

    const storedToken = loadTokenFromStorage();
    const storedUserInfo = loadUserInfoFromStorage();
    const storedAuthorities = loadAuthoritiesFromStorage();

    if (storedToken && storedUserInfo) {
      setAuthCookie(storedToken);
      void useMenuStore.getState().fetchMenus().catch(() => undefined);

      const hydratedUserInfo: UserInfo =
        storedAuthorities.length > 0
          ? { ...storedUserInfo, permissions: storedAuthorities }
          : storedUserInfo;

      set({
        token: storedToken,
        userInfo: hydratedUserInfo,
        isLoggedIn: true,
        authorities: storedAuthorities,
      });
      persistUserInfo(hydratedUserInfo);
      return true;
    }

    return false;
  },
  setAuthorities: (authorities) => {
    persistAuthorities(authorities);
    set({ authorities });
  },
}));





