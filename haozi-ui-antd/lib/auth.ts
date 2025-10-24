// Token 相关操作
const TOKEN_KEY = 'haozi_token';
const USER_INFO_KEY = 'haozi_user_info';

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email?: string;
  avatar?: string;
  phone?: string;
  roles: string[];
  permissions: string[];
}

// Token 管理
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

// 用户信息管理
export const getUserInfo = (): UserInfo | null => {
  if (typeof window !== 'undefined') {
    const userInfoStr = localStorage.getItem(USER_INFO_KEY);
    if (userInfoStr) {
      try {
        return JSON.parse(userInfoStr);
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

// 清除所有认证信息
export const clearAuth = (): void => {
  removeToken();
  removeUserInfo();
};

// 检查是否有权限
export const hasPermission = (permission: string | string[]): boolean => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.permissions) {
    return false;
  }

  if (Array.isArray(permission)) {
    return permission.some(p => userInfo.permissions.includes(p));
  }

  return userInfo.permissions.includes(permission);
};

// 检查是否有角色
export const hasRole = (role: string | string[]): boolean => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.roles) {
    return false;
  }

  if (Array.isArray(role)) {
    return role.some(r => userInfo.roles.includes(r));
  }

  return userInfo.roles.includes(role);
};

// 检查是否已登录
export const isLoggedIn = (): boolean => {
  return !!getToken();
};

// 登录
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  userInfo: UserInfo;
}

// 注册
export interface RegisterParams {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
  phone?: string;
  captcha?: string;
}