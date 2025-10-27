'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Modal, Spin } from 'antd';
import type { ModalProps } from 'antd';
import { RouteHelper } from '@/utils/routeHelper';

// React风格路由模态框配置
export interface ReactRouteModalConfig {
  // 基础路径，如 "system/menu"
  basePath: string;
  // 模态框操作类型
  action: 'create' | 'edit' | 'view' | 'delete';
  // 弹窗标题（可选，会自动生成）
  title?: string;
  // 弹窗宽度
  width?: number | string;
  // 是否可关闭
  closable?: boolean;
  // 点击蒙层是否可关闭
  maskClosable?: boolean;
  // 是否销毁时隐藏内容
  destroyOnClose?: boolean;
}

// 模态框参数
export interface ModalParams {
  action: string;
  id?: string;
  [key: string]: string | undefined;
}

// 路由模态框属性
export interface ReactRouteModalProps extends Omit<ModalProps, 'open' | 'onCancel'> {
  // 基础路径，如 "system/menu"
  basePath: string;
  // 支持的操作类型
  actions?: string[];
  // 弹窗内容渲染函数
  children: (params: ModalParams, close: () => void) => React.ReactNode;
  // 自定义关闭处理
  onClose?: () => void;
  // 加载状态
  loading?: boolean;
  // 默认弹窗配置
  defaultConfig?: Partial<ReactRouteModalConfig>;
}

/**
 * React风格路由模态框组件
 *
 * 使用示例:
 * ```tsx
 * <ReactRouteModal
 *   basePath="system/menu"
 *   actions={['create', 'edit', 'view']}
 *   defaultConfig={{ width: 800 }}
 * >
 *   {(params, close) => (
 *     <MenuForm
 *       id={params.id}
 *       mode={params.action}
 *       onSuccess={close}
 *       onCancel={close}
 *     />
 *   )}
 * </ReactRouteModal>
 * ```
 */
export function ReactRouteModal({
  basePath,
  actions = ['create', 'edit', 'view'],
  children,
  onClose,
  loading = false,
  defaultConfig = {},
  ...modalProps
}: ReactRouteModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 解析当前路由是否匹配模态框
  const modalState = useMemo(() => {
    return parseReactModalRoute(pathname, basePath, actions);
  }, [pathname, basePath, actions]);

  // 关闭模态框
  const handleClose = useCallback(() => {
    const basePathRoute = RouteHelper.generateRoute(`${basePath}/page`);
    router.push(basePathRoute);
    onClose?.();
  }, [router, basePath, onClose]);

  // 监听浏览器后退事件
  useEffect(() => {
    const handlePopState = () => {
      if (modalState.isOpen) {
        handleClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [modalState.isOpen, handleClose]);

  // 弹窗打开时锁定背景滚动
  useEffect(() => {
    if (modalState.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalState.isOpen]);

  // 如果不匹配，返回null
  if (!modalState.isOpen) {
    return null;
  }

  // 生成弹窗标题
  const generateTitle = (action: string): string => {
    const actionTitles = {
      create: '创建',
      edit: '编辑',
      view: '查看',
      delete: '删除'
    };

    const baseName = RouteHelper.parseBreadcrumbs(`${basePath}/page`).pop() || '项目';
    return `${actionTitles[action as keyof typeof actionTitles] || action}${baseName}`;
  };

  return (
    <Modal
      title={defaultConfig.title || generateTitle(modalState.params!.action)}
      open={modalState.isOpen}
      onCancel={handleClose}
      closable={defaultConfig.closable ?? true}
      maskClosable={defaultConfig.maskClosable ?? false}
      width={defaultConfig.width || 800}
      footer={null}
      destroyOnClose={defaultConfig.destroyOnClose ?? true}
      {...modalProps}
    >
      <Spin spinning={loading}>
        {typeof children === 'function'
          ? children(modalState.params!, handleClose)
          : children
        }
      </Spin>
    </Modal>
  );
}

/**
 * 解析React风格模态框路由
 *
 * @param pathname 当前路径
 * @param basePath 基础路径
 * @param actions 支持的操作类型
 * @returns 解析结果
 */
function parseReactModalRoute(
  pathname: string,
  basePath: string,
  actions: string[]
): { isOpen: boolean; params?: ModalParams } {
  // 构建匹配模式
  const modalPathPattern = `/${basePath}/modal/`;

  if (!pathname.startsWith(modalPathPattern)) {
    return { isOpen: false };
  }

  // 提取模态框路径部分
  const modalPathPart = pathname.replace(modalPathPattern, '');
  const segments = modalPathPart.split('/').filter(Boolean);

  if (segments.length === 0) {
    return { isOpen: false };
  }

  const action = segments[0];

  // 检查是否为支持的操作
  if (!actions.includes(action)) {
    return { isOpen: false };
  }

  // 解析参数
  const params: ModalParams = { action };

  // 如果有ID参数
  if (segments[1]) {
    params.id = segments[1];
  }

  // 解析其他键值对参数
  for (let i = 2; i < segments.length; i += 2) {
    if (segments[i] && segments[i + 1]) {
      params[segments[i]] = segments[i + 1];
    }
  }

  return { isOpen: true, params };
}

/**
 * Hook：用于打开React风格路由模态框
 */
export function useReactRouteModal() {
  const router = useRouter();
  const pathname = usePathname();

  // 打开模态框
  const openModal = useCallback((
    basePath: string,
    action: string,
    params?: Record<string, string>
  ) => {
    const modalPath = RouteHelper.generateModalRoute(`${basePath}/page`, action, params?.id);

    // 添加额外参数
    if (params && Object.keys(params).length > 1) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (key !== 'id' && value) {
          searchParams.set(key, value);
        }
      });

      if (searchParams.toString()) {
        return router.push(`${modalPath}?${searchParams.toString()}`);
      }
    }

    router.push(modalPath);
  }, [router]);

  // 关闭模态框
  const closeModal = useCallback(() => {
    // 从当前路径提取基础路径
    const basePath = pathname.replace(/\/modal\/[^\/]*$/, '').replace(/\/modal\/[^\/]*\/[^\/]*$/, '');
    const pagePath = RouteHelper.generateRoute(`${basePath}/page`);
    router.push(pagePath);
  }, [router, pathname]);

  // 检查模态框是否打开
  const isModalOpen = useCallback((
    currentPath: string,
    basePath: string,
    actions: string[] = ['create', 'edit', 'view']
  ) => {
    const { isOpen } = parseReactModalRoute(currentPath, basePath, actions);
    return isOpen;
  }, []);

  // 获取当前模态框参数
  const getCurrentModalParams = useCallback((
    currentPath: string,
    basePath: string,
    actions: string[] = ['create', 'edit', 'view']
  ) => {
    const { params } = parseReactModalRoute(currentPath, basePath, actions);
    return params;
  }, []);

  return {
    openModal,
    closeModal,
    isModalOpen,
    getCurrentModalParams
  };
}

/**
 * 高阶组件：为页面添加路由模态框支持
 */
export function withRouteModal<P extends object>(
  Component: React.ComponentType<P>,
  modalConfig: {
    basePath: string;
    actions?: string[];
    modalProps?: Omit<ReactRouteModalProps, 'basePath' | 'actions' | 'children'>;
  }
) {
  return function WrappedComponent(props: P) {
    return (
      <>
        <Component {...props} />
        <ReactRouteModal
          basePath={modalConfig.basePath}
          actions={modalConfig.actions}
          {...modalConfig.modalProps}
        >
          {modalConfig.modalProps?.children as any}
        </ReactRouteModal>
      </>
    );
  };
}