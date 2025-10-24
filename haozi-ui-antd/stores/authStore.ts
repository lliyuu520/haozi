import { create } from 'zustand';
import {
  UserInfo,
  LoginParams,
  LoginResponse,
  getToken as loadTokenFromStorage,
  getUserInfo as loadUserInfoFromStorage,
  setToken as persistToken,
  setUserInfo as persistUserInfo,
  removeToken as clearStoredToken,
  removeUserInfo as clearStoredUserInfo,
} from '@/lib/auth';
import { request } from '@/lib/api';

interface AuthState {
  // 状态
  token: string | null;
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  loading: boolean;

  // 操作
  login: (params: LoginParams) => Promise<boolean>;
  logout: () => void;
  updateUserInfo: (userInfo: Partial<UserInfo>) => void;
  checkAuth: () => boolean;
}

const COOKIE_NAME = 'haozi_token';
const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 8; // 8 小时
const REMEMBER_ME_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 天

const resolveInitialAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null, userInfo: null };
  }

  const token = loadTokenFromStorage();
  const userInfo = loadUserInfoFromStorage();
  return { token, userInfo };
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
  // 初始状态
  token: initialAuth.token,
  userInfo: initialAuth.userInfo,
  isLoggedIn: Boolean(initialAuth.token && initialAuth.userInfo),
  loading: false,

  // 登录
  login: async (params: LoginParams) => {
    set({ loading: true });

    try {
      const response = await request.post<LoginResponse>('/sys/auth/login', params);
      const { data } = response.data;

      if (data?.token && data?.userInfo) {
        persistToken(data.token);
        persistUserInfo(data.userInfo);
        setAuthCookie(data.token, params.rememberMe);

        set({
          token: data.token,
          userInfo: data.userInfo,
          isLoggedIn: true,
          loading: false,
        });

        return true;
      }

      set({ loading: false });
      return false;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // 登出
  logout: () => {
    clearStoredToken();
    clearStoredUserInfo();
    clearAuthCookie();

    set({
      token: null,
      userInfo: null,
      isLoggedIn: false,
    });
  },

  // 更新用户信息
  updateUserInfo: (newUserInfo) => {
    const { userInfo } = get();
    if (userInfo) {
      const updatedUserInfo = { ...userInfo, ...newUserInfo };
      set({ userInfo: updatedUserInfo });
      persistUserInfo(updatedUserInfo);
    }
  },

  // 检查认证状态
  checkAuth: () => {
    const { token, userInfo } = get();
    if (token && userInfo) {
      return true;
    }

    const storedToken = loadTokenFromStorage();
    const storedUserInfo = loadUserInfoFromStorage();

    if (storedToken && storedUserInfo) {
      setAuthCookie(storedToken);
      set({
        token: storedToken,
        userInfo: storedUserInfo,
        isLoggedIn: true,
      });
      return true;
    }

    return false;
  },
}));
