import type { RawMenuNode } from '@/types/menu';

// Storage key constants
const TOKEN_KEY = 'haozi_token';
const USER_INFO_KEY = 'haozi_user_info';

export interface UserInfo {
  id: number;
  username: string;
  roleIdList: string[];
  permissions: string[];
}

// Token helpers
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// User info helpers
export const getUserInfo = (): UserInfo | null => {
  if (typeof window !== 'undefined') {
    const userInfoStr = localStorage.getItem(USER_INFO_KEY);

    if (userInfoStr) {
      try {
        return JSON.parse(userInfoStr) as UserInfo;
      } catch {
        removeUserInfo();
        return null;
      }
    }
  }

  return null;
};

export const setUserInfo = (userInfo: UserInfo): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }
};

export const removeUserInfo = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_INFO_KEY);
  }
};


// Clear all persisted auth information
export const clearAuth = (): void => {
  removeToken();
  removeUserInfo();
};

// Permission helpers
export const hasPermission = (permission: string | string[]): boolean => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.permissions) {
    return false;
  }

  if (Array.isArray(permission)) {
    return permission.some(item => userInfo.permissions.includes(item));
  }

  return userInfo.permissions.includes(permission);
};




// Login payloads
export interface LoginParams {
  username: string;
  password: string;
}

// 后端登录响应的原始结构
export interface BackendLoginResponse {
  accessToken: string;
  sysUserCache: {
    id: string;
    username: string;
    roleIdList: string[];
  };
  permissions: string[];
  menuTree: RawMenuNode[];
}

// Register payload
export interface RegisterParams {
  username: string;
  password: string;
  confirmPassword: string;
}
