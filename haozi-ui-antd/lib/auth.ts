// Storage key constants
const TOKEN_KEY = 'haozi_token';
const USER_INFO_KEY = 'haozi_user_info';
const AUTHORITIES_KEY = 'haozi_authorities';

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

// Authority helpers
export const getAuthorities = (): string[] => {
  if (typeof window !== 'undefined') {
    const authorities = localStorage.getItem(AUTHORITIES_KEY);
    if (authorities) {
      try {
        return JSON.parse(authorities) as string[];
      } catch {
        removeAuthorities();
        return [];
      }
    }
  }

  return [];
};

export const setAuthorities = (authorities: string[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }
};

export const removeAuthorities = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTHORITIES_KEY);
  }
};

// Clear all persisted auth information
export const clearAuth = (): void => {
  removeToken();
  removeUserInfo();
  removeAuthorities();
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

// Role helpers
export const hasRole = (role: string | string[]): boolean => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.roles) {
    return false;
  }

  if (Array.isArray(role)) {
    return role.some(item => userInfo.roles.includes(item));
  }

  return userInfo.roles.includes(role);
};

// Logged-in state helper
export const isLoggedIn = (): boolean => {
  return Boolean(getToken());
};

// Login payloads
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  userInfo?: UserInfo;
}

// Register payload
export interface RegisterParams {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
  phone?: string;
  captcha?: string;
}
