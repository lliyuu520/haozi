'use client';

import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { RouteModalConfig } from '@/components/ui/RouteModal';
import type { ModalParams } from '@/types/modal';

// 生成路由路径的工具函数
function generateModalPath(
  basePath: string,
  config: RouteModalConfig,
  params?: ModalParams
): string {
  if (config.mode === 'path') {
    let path = config.pathPrefix || basePath;

    if (params) {
      const paramSegments = Object.entries(params)
        .filter(([key]) => key !== 'modal')
        .map(([key, value]) => `/${encodeURIComponent(key)}/${encodeURIComponent(String(value))}`)
        .join('');

      if (paramSegments) {
        path += paramSegments;
      }
    }

    return path;
  } else {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (key === 'modal') {
          searchParams.set(config.queryParam || 'modal', String(value));
        } else {
          searchParams.set(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  }
}

// 解析当前路径获取基础路径
function getBasePath(pathname: string): string {
  // 移除弹窗路径部分，返回基础路径
  return pathname.replace(/\/[^\/]+-modal(\/.*)?$/, '') || pathname;
}

// 路由弹窗操作 Hook
export function useRouteModal() {
  const router = useRouter();
  const pathname = usePathname();

  // 打开弹窗
  const openModal = useCallback((
    config: RouteModalConfig,
    params?: ModalParams
  ) => {
    const basePath = getBasePath(pathname);
    const modalPath = generateModalPath(basePath, config, params);
    router.push(modalPath);
  }, [router, pathname]);

  // 关闭弹窗
  const closeModal = useCallback(() => {
    const basePath = getBasePath(pathname);
    router.push(basePath);
  }, [router, pathname]);

  // 替换弹窗参数（不增加历史记录）
  const replaceModal = useCallback((
    config: RouteModalConfig,
    params?: ModalParams
  ) => {
    const basePath = getBasePath(pathname);
    const modalPath = generateModalPath(basePath, config, params);
    router.replace(modalPath);
  }, [router, pathname]);

  return {
    openModal,
    closeModal,
    replaceModal,
  };
}

// 获取当前弹窗参数的 Hook
export function useModalParams() {
  const pathname = usePathname();

  return useCallback(() => {
    // 检查是否是弹窗路由
    const modalMatch = pathname.match(/\/([^\/]+)-modal(?:\/(.+))?$/);

    if (!modalMatch) {
      return null;
    }

    const [, modalType] = modalMatch;
    const paramString = modalMatch[2];

    const params: Record<string, string> = { modal: modalType };

    if (paramString) {
      const segments = paramString.split('/');
      for (let i = 0; i < segments.length; i += 2) {
        if (segments[i] && segments[i + 1]) {
          params[decodeURIComponent(segments[i])] = decodeURIComponent(segments[i + 1]);
        }
      }
    }

    return params;
  }, [pathname]);
}