'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { message } from 'antd';
import { RouteHelper } from '@/utils/routeHelper';

// 路由守卫配置
export interface RouteGuardConfig {
  // 是否启用权限检查
  enablePermissionCheck?: boolean;
  // 是否启用登录检查
  enableAuthCheck?: boolean;
  // 权限检查函数
  checkPermission?: (path: string, userPermissions?: string[]) => boolean;
  // 登录检查函数
  checkAuth?: () => boolean;
  // 未授权时的重定向路径
  unauthorizedRedirect?: string;
  // 未登录时的重定向路径
  loginRedirect?: string;
  // 需要权限的路径模式
  protectedPatterns?: RegExp[];
  // 模态框路径模式
  modalPatterns?: RegExp[];
}

// 模态框守卫配置
export interface ModalGuardConfig {
  // 允许的基础路径
  allowedBasePaths: string[];
  // 允许的操作类型
  allowedActions: string[];
  // 权限检查函数
  checkModalPermission?: (basePath: string, action: string, id?: string) => boolean;
  // 权限不足时的处理
  onPermissionDenied?: (basePath: string, action: string, id?: string) => void;
  // 参数验证函数
  validateParams?: (basePath: string, action: string, params: Record<string, string>) => boolean;
  // 参数验证失败时的处理
  onValidationFailed?: (basePath: string, action: string, params: Record<string, string>) => void;
}

/**
 * 路由守卫Hook
 */
export function useRouteGuard(config: RouteGuardConfig = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    enablePermissionCheck = true,
    enableAuthCheck = true,
    checkPermission,
    checkAuth,
    unauthorizedRedirect = '/403',
    loginRedirect = '/login',
    protectedPatterns = [/^\/system\/.*/, /^\/dashboard\/.*/],
    modalPatterns = [/\/modal\//]
  } = config;

  // 检查是否为模态框路由
  const isModalRoute = useCallback((path: string): boolean => {
    return modalPatterns.some(pattern => pattern.test(path));
  }, [modalPatterns]);

  // 检查是否为受保护的路由
  const isProtectedRoute = useCallback((path: string): boolean => {
    return protectedPatterns.some(pattern => pattern.test(path));
  }, [protectedPatterns]);

  // 检查登录状态
  const checkLoginStatus = useCallback((): boolean => {
    if (checkAuth) {
      return checkAuth();
    }

    // 默认检查token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      return Boolean(token);
    }

    return false;
  }, [checkAuth]);

  // 检查权限
  const checkRoutePermission = useCallback((path: string): boolean => {
    if (checkPermission) {
      const userPermissions = getUserPermissions();
      return checkPermission(path, userPermissions);
    }

    // 默认权限检查逻辑
    return checkDefaultPermissions(path);
  }, [checkPermission]);

  // 获取用户权限
  const getUserPermissions = useCallback((): string[] => {
    if (typeof window !== 'undefined') {
      const permissions = localStorage.getItem('userPermissions');
      return permissions ? JSON.parse(permissions) : [];
    }
    return [];
  }, []);

  // 默认权限检查
  const checkDefaultPermissions = useCallback((path: string): boolean => {
    const userPermissions = getUserPermissions();

    // 根据路径检查权限
    if (path.includes('/system/menu')) {
      return userPermissions.includes('sys:menu:list');
    }
    if (path.includes('/system/user')) {
      return userPermissions.includes('sys:user:list');
    }
    if (path.includes('/system/role')) {
      return userPermissions.includes('sys:role:list');
    }

    return true;
  }, [getUserPermissions]);

  // 执行路由守卫检查
  const executeGuardCheck = useCallback(() => {
    // 检查登录状态
    if (enableAuthCheck && isProtectedRoute(pathname) && !checkLoginStatus()) {
      message.warning('请先登录');
      router.push(loginRedirect);
      return false;
    }

    // 检查权限
    if (enablePermissionCheck && isProtectedRoute(pathname) && !checkRoutePermission(pathname)) {
      message.error('权限不足，无法访问该页面');
      router.push(unauthorizedRedirect);
      return false;
    }

    return true;
  }, [
    pathname,
    enableAuthCheck,
    enablePermissionCheck,
    isProtectedRoute,
    checkLoginStatus,
    checkRoutePermission,
    loginRedirect,
    unauthorizedRedirect,
    router
  ]);

  // 路由变化时执行守卫检查
  useEffect(() => {
    executeGuardCheck();
  }, [executeGuardCheck]);

  return {
    isModalRoute: isModalRoute(pathname),
    isProtectedRoute: isProtectedRoute(pathname),
    checkLoginStatus,
    checkRoutePermission,
    executeGuardCheck
  };
}

/**
 * 模态框守卫Hook
 */
export function useModalGuard(config: ModalGuardConfig) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    allowedBasePaths,
    allowedActions,
    checkModalPermission,
    onPermissionDenied,
    validateParams,
    onValidationFailed
  } = config;

  // 解析模态框路由参数
  const parseModalRoute = useCallback(() => {
    const modalMatch = pathname.match(/\/(.+?)\/modal\/(.+?)(?:\/(.+))?$/);
    if (!modalMatch) {
      return null;
    }

    const [, basePath, action, id] = modalMatch;
    return { basePath, action, id };
  }, [pathname]);

  // 验证基础路径
  const validateBasePath = useCallback((basePath: string): boolean => {
    return allowedBasePaths.includes(basePath);
  }, [allowedBasePaths]);

  // 验证操作类型
  const validateAction = useCallback((action: string): boolean => {
    return allowedActions.includes(action);
  }, [allowedActions]);

  // 执行模态框守卫检查
  const executeModalGuard = useCallback(() => {
    const routeInfo = parseModalRoute();
    if (!routeInfo) {
      return true;
    }

    const { basePath, action, id } = routeInfo;

    // 验证基础路径
    if (!validateBasePath(basePath)) {
      console.error(`不允许的模态框基础路径: ${basePath}`);
      router.push('/404');
      return false;
    }

    // 验证操作类型
    if (!validateAction(action)) {
      console.error(`不允许的模态框操作: ${action}`);
      router.push('/404');
      return false;
    }

    // 检查权限
    if (checkModalPermission && !checkModalPermission(basePath, action, id)) {
      console.error(`模态框权限不足: ${basePath}/${action}`);
      if (onPermissionDenied) {
        onPermissionDenied(basePath, action, id);
      } else {
        message.error('权限不足');
        router.push(RouteHelper.generateRoute(`${basePath}/page`));
      }
      return false;
    }

    // 验证参数
    const params = { action, id };
    if (validateParams && !validateParams(basePath, action, params)) {
      console.error(`模态框参数验证失败: ${basePath}/${action}`, params);
      if (onValidationFailed) {
        onValidationFailed(basePath, action, params);
      } else {
        message.error('参数错误');
        router.push(RouteHelper.generateRoute(`${basePath}/page`));
      }
      return false;
    }

    return true;
  }, [
    parseModalRoute,
    validateBasePath,
    validateAction,
    checkModalPermission,
    onPermissionDenied,
    validateParams,
    onValidationFailed,
    router
  ]);

  // 路由变化时执行模态框守卫检查
  useEffect(() => {
    executeModalGuard();
  }, [executeModalGuard]);

  return {
    routeInfo: parseModalRoute(),
    isValid: executeModalGuard(),
    validateBasePath,
    validateAction
  };
}

/**
 * 组合守卫Hook
 * 同时使用路由守卫和模态框守卫
 */
export function useCombinedRouteGuard(
  routeGuardConfig?: RouteGuardConfig,
  modalGuardConfig?: ModalGuardConfig
) {
  const routeGuard = useRouteGuard(routeGuardConfig);

  const modalGuard = modalGuardConfig
    ? useModalGuard(modalGuardConfig)
    : null;

  return {
    ...routeGuard,
    modalGuard,
    isModalRoute: routeGuard.isModalRoute,
    isValid: routeGuard.executeGuardCheck() && (!modalGuard || modalGuard.isValid)
  };
}

/**
 * 权限检查工具函数
 */
export const PermissionUtils = {
  // 检查用户是否有指定权限
  hasPermission: (permission: string, userPermissions?: string[]): boolean => {
    const permissions = userPermissions || PermissionUtils.getUserPermissions();
    return permissions.includes(permission);
  },

  // 检查用户是否有任意一个权限
  hasAnyPermission: (permissions: string[], userPermissions?: string[]): boolean => {
    const userPerms = userPermissions || PermissionUtils.getUserPermissions();
    return permissions.some(permission => userPerms.includes(permission));
  },

  // 检查用户是否有所有权限
  hasAllPermissions: (permissions: string[], userPermissions?: string[]): boolean => {
    const userPerms = userPermissions || PermissionUtils.getUserPermissions();
    return permissions.every(permission => userPerms.includes(permission));
  },

  // 获取用户权限
  getUserPermissions: (): string[] => {
    if (typeof window !== 'undefined') {
      const permissions = localStorage.getItem('userPermissions');
      return permissions ? JSON.parse(permissions) : [];
    }
    return [];
  },

  // 从路径提取所需权限
  extractRequiredPermission: (path: string): string | null => {
    const pathPermissionMap: Record<string, string> = {
      '/system/menu': 'sys:menu:list',
      '/system/user': 'sys:user:list',
      '/system/role': 'sys:role:list',
      '/system/dict': 'sys:dict:list'
    };

    for (const [route, permission] of Object.entries(pathPermissionMap)) {
      if (path.startsWith(route)) {
        return permission;
      }
    }

    return null;
  }
};