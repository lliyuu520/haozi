'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Modal, Spin } from 'antd';
import type { ModalProps } from 'antd';

// 路由弹窗配置接口
export interface RouteModalConfig {
  // 路由模式：path 或 query
  mode: 'path' | 'query';
  // path模式下的路由前缀，如 '/users/create-modal'
  pathPrefix?: string;
  // query模式下的参数名，如 'modal=create'
  queryParam?: string;
  // 弹窗标题
  title?: string;
  // 弹窗宽度
  width?: number | string;
  // 是否可关闭
  closable?: boolean;
  // 点击蒙层是否可关闭
  maskClosable?: boolean;
}

// 解析路由获取弹窗信息
function parseModalRoute(
  pathname: string,
  searchParams: URLSearchParams,
  config: RouteModalConfig
): { isOpen: boolean; params?: Record<string, string> } {
  if (config.mode === 'path') {
    const prefix = config.pathPrefix;
    if (prefix && pathname.startsWith(prefix)) {
      // 提取路径参数，如 /users/123/edit-modal -> { id: '123' }
      const paramStr = pathname.replace(prefix, '').replace(/^\//, '');
      const params: Record<string, string> = {};

      if (paramStr) {
        const segments = paramStr.split('/');
        for (let i = 0; i < segments.length; i += 2) {
          if (segments[i] && segments[i + 1]) {
            params[segments[i]] = segments[i + 1];
          }
        }
      }

      return { isOpen: true, params };
    }
  } else {
    // query模式
    const modalValue = searchParams.get(config.queryParam || 'modal');
    if (modalValue) {
      const params: Record<string, string> = { modal: modalValue };

      // 解析其他查询参数
      for (const [key, value] of searchParams.entries()) {
        if (key !== config.queryParam) {
          params[key] = value;
        }
      }

      return { isOpen: true, params };
    }
  }

  return { isOpen: false };
}

// 生成路由路径
function generateModalPath(
  basePath: string,
  config: RouteModalConfig,
  params?: Record<string, string>
): string {
  if (config.mode === 'path') {
    let path = config.pathPrefix || basePath;

    if (params) {
      const paramSegments = Object.entries(params)
        .map(([key, value]) => `/${key}/${value}`)
        .join('');
      path += paramSegments;
    }

    return path;
  } else {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (key === 'modal') {
          searchParams.set(config.queryParam || 'modal', value);
        } else {
          searchParams.set(key, value);
        }
      });
    }

    const queryString = searchParams.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  }
}

// 路由弹窗组件属性
export interface RouteModalProps extends Omit<ModalProps, 'open' | 'onCancel'> {
  // 弹窗配置
  config: RouteModalConfig;
  // 基础路径（弹窗关闭后要返回的路径）
  basePath: string;
  // 弹窗内容组件
  children: React.ReactNode;
  // 弹窗参数
  params?: Record<string, string>;
  // 自定义关闭处理
  onClose?: () => void;
  // 加载状态
  loading?: boolean;
}

// 路由弹窗容器组件
export function RouteModal({
  config,
  basePath,
  children,
  params,
  onClose,
  loading = false,
  ...modalProps
}: RouteModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 检查当前路由是否匹配弹窗状态
  const { isOpen, params: routeParams } = parseModalRoute(pathname, searchParams, config);

  // 合并路由参数和传入参数
  const allParams = { ...routeParams, ...params };

  // 关闭弹窗
  const handleClose = useCallback(() => {
    // 回退到基础路径
    router.push(basePath);
    onClose?.();
  }, [router, basePath, onClose]);

  // 监听浏览器后退事件
  useEffect(() => {
    const handlePopState = () => {
      // 后退时自动关闭弹窗
      if (isOpen) {
        handleClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, handleClose]);

  // 弹窗打开时锁定背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      title={config.title}
      open={isOpen}
      onCancel={handleClose}
      closable={config.closable ?? true}
      maskClosable={config.maskClosable ?? false}
      width={config.width}
      footer={null}
      destroyOnHidden
      {...modalProps}
    >
      <Spin spinning={loading}>
        {typeof children === 'function' ? children(allParams) : children}
      </Spin>
    </Modal>
  );
}

// Hook：用于打开路由弹窗
export function useRouteModal() {
  const router = useRouter();
  const pathname = usePathname();

  // 打开弹窗
  const openModal = useCallback((
    config: RouteModalConfig,
    params?: Record<string, string>
  ) => {
    const basePath = pathname.replace(/\/[^\/]+-modal.*$/, '') || pathname;
    const modalPath = generateModalPath(basePath, config, params);
    router.push(modalPath);
  }, [router, pathname]);

  // 关闭弹窗
  const closeModal = useCallback(() => {
    const basePath = pathname.replace(/\/[^\/]+-modal.*$/, '') || pathname;
    router.push(basePath);
  }, [router, pathname]);

  // 检查弹窗是否打开
  const isModalOpen = useCallback((config: RouteModalConfig) => {
    const { isOpen } = parseModalRoute(pathname, new URLSearchParams(window.location.search), config);
    return isOpen;
  }, [pathname]);

  return {
    openModal,
    closeModal,
    isModalOpen
  };
}

// Hook：获取当前弹窗参数
export function useRouteModalParams(config: RouteModalConfig) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return parseModalRoute(pathname, searchParams, config).params;
}