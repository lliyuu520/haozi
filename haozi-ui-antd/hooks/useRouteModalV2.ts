'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { message } from 'antd';
import { RouteHelper } from '@/utils/routeHelper';

// 模态框状态
export interface ModalState {
  isOpen: boolean;
  action?: string;
  id?: string;
  params?: Record<string, string>;
}

// 模态框配置
export interface ModalConfig {
  // 基础路径，如 "system/menu"
  basePath: string;
  // 支持的操作类型
  actions: string[];
  // 默认弹窗属性
  defaultProps?: {
    width?: number;
    closable?: boolean;
    maskClosable?: boolean;
    destroyOnClose?: boolean;
  };
  // 操作标题映射
  actionTitles?: Record<string, string>;
  // 资源名称
  resourceName?: string;
}

/**
 * 增强版路由模态框Hook
 * 支持更复杂的模态框管理场景
 */
export function useRouteModalV2(config: ModalConfig) {
  const router = useRouter();
  const pathname = usePathname();
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false });

  // 解析当前路径的模态框状态
  const parseModalState = useCallback((): ModalState => {
    const modalPathPattern = `/${config.basePath}/modal/`;

    if (!pathname.startsWith(modalPathPattern)) {
      return { isOpen: false };
    }

    const modalPathPart = pathname.replace(modalPathPattern, '');
    const segments = modalPathPart.split('/').filter(Boolean);

    if (segments.length === 0) {
      return { isOpen: false };
    }

    const action = segments[0];

    // 检查是否为支持的操作
    if (!config.actions.includes(action)) {
      return { isOpen: false };
    }

    const params: Record<string, string> = { action };

    // 提取ID
    if (segments[1]) {
      params.id = segments[1];
    }

    // 提取其他参数
    for (let i = 2; i < segments.length; i += 2) {
      if (segments[i] && segments[i + 1]) {
        params[segments[i]] = segments[i + 1];
      }
    }

    return {
      isOpen: true,
      action,
      id: params.id,
      params
    };
  }, [pathname, config]);

  // 更新模态框状态
  useEffect(() => {
    setModalState(parseModalState());
  }, [parseModalState]);

  // 打开模态框
  const openModal = useCallback((
    action: string,
    params?: Record<string, string>
  ) => {
    if (!config.actions.includes(action)) {
      message.error(`不支持的操作类型: ${action}`);
      return;
    }

    const modalUrl = RouteHelper.generateModalRoute(
      `${config.basePath}/page`,
      action,
      params?.id
    );

    // 处理额外参数
    if (params && Object.keys(params).length > (params.id ? 1 : 0)) {
      const otherParams = { ...params };
      delete otherParams.id;

      const searchParams = new URLSearchParams();
      Object.entries(otherParams).forEach(([key, value]) => {
        if (value) searchParams.set(key, value);
      });

      if (searchParams.toString()) {
        router.push(`${modalUrl}?${searchParams.toString()}`);
        return;
      }
    }

    router.push(modalUrl);
  }, [config, router]);

  // 关闭模态框
  const closeModal = useCallback((callback?: () => void) => {
    const basePath = RouteHelper.generateRoute(`${config.basePath}/page`);
    router.push(basePath);

    if (callback) {
      // 延迟执行回调，等待路由完成
      setTimeout(callback, 100);
    }
  }, [config, router]);

  // 刷新模态框（重新加载当前模态框内容）
  const refreshModal = useCallback(() => {
    if (modalState.isOpen) {
      router.refresh();
    }
  }, [modalState.isOpen, router]);

  // 替换模态框状态（用于切换编辑/查看模式）
  const replaceModal = useCallback((
    newAction: string,
    newParams?: Record<string, string>
  ) => {
    if (!modalState.isOpen) {
      return;
    }

    const modalUrl = RouteHelper.generateModalRoute(
      `${config.basePath}/page`,
      newAction,
      newParams?.id || modalState.id
    );

    router.replace(modalUrl);
  }, [modalState, config, router]);

  // 生成模态框标题
  const generateTitle = useCallback((): string => {
    if (!modalState.action) return '';

    const actionTitle = config.actionTitles?.[modalState.action] || modalState.action;
    const resourceName = config.resourceName ||
      RouteHelper.parseBreadcrumbs(`${config.basePath}/page`).pop() || '项目';

    return `${actionTitle}${resourceName}`;
  }, [modalState.action, config]);

  // 获取操作类型的显示名称
  const getActionDisplayName = useCallback((action: string): string => {
    return config.actionTitles?.[action] || action;
  }, [config.actionTitles]);

  // 检查是否为指定操作
  const isAction = useCallback((action: string): boolean => {
    return modalState.action === action;
  }, [modalState.action]);

  // 验证模态框参数
  const validateModalParams = useCallback((): boolean => {
    if (!modalState.isOpen) return false;

    // 某些操作需要ID参数
    const actionsRequiringId = ['edit', 'view', 'delete'];
    if (actionsRequiringId.includes(modalState.action!) && !modalState.id) {
      message.error(`${getActionDisplayName(modalState.action!)}操作需要ID参数`);
      return false;
    }

    return true;
  }, [modalState, getActionDisplayName]);

  // 获取完整的模态框URL
  const getModalUrl = useCallback((
    action: string,
    params?: Record<string, string>
  ): string => {
    return RouteHelper.generateModalRoute(
      `${config.basePath}/page`,
      action,
      params?.id
    );
  }, [config.basePath]);

  return {
    // 状态
    modalState,
    isOpen: modalState.isOpen,
    action: modalState.action,
    id: modalState.id,
    params: modalState.params,

    // 操作方法
    openModal,
    closeModal,
    refreshModal,
    replaceModal,

    // 工具方法
    generateTitle,
    getActionDisplayName,
    isAction,
    validateModalParams,
    getModalUrl,

    // 配置
    config
  };
}

/**
 * 简化版路由模态框Hook
 * 用于快速实现基本的模态框功能
 */
export function useSimpleRouteModal(basePath: string, resourceName?: string) {
  return useRouteModalV2({
    basePath,
    actions: ['create', 'edit', 'view'],
    actionTitles: {
      create: '创建',
      edit: '编辑',
      view: '查看'
    },
    resourceName,
    defaultProps: {
      width: 800,
      closable: true,
      maskClosable: false
    }
  });
}

/**
 * 批量模态框管理Hook
 * 用于管理多个不同类型的模态框
 */
export function useMultipleRouteModals(modalConfigs: Array<{
  key: string;
  basePath: string;
  actions: string[];
  resourceName?: string;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  // 解析当前激活的模态框
  const activeModal = useMemo(() => {
    for (const config of modalConfigs) {
      const modalPathPattern = `/${config.basePath}/modal/`;
      if (pathname.startsWith(modalPathPattern)) {
        return config.key;
      }
    }
    return null;
  }, [pathname, modalConfigs]);

  // 打开指定类型的模态框
  const openModal = useCallback((
    modalKey: string,
    action: string,
    params?: Record<string, string>
  ) => {
    const config = modalConfigs.find(c => c.key === modalKey);
    if (!config) {
      message.error(`未找到模态框配置: ${modalKey}`);
      return;
    }

    const modalUrl = RouteHelper.generateModalRoute(
      `${config.basePath}/page`,
      action,
      params?.id
    );

    router.push(modalUrl);
  }, [modalConfigs, router]);

  // 关闭当前模态框
  const closeModal = useCallback(() => {
    if (activeModal) {
      const config = modalConfigs.find(c => c.key === activeModal);
      if (config) {
        const basePath = RouteHelper.generateRoute(`${config.basePath}/page`);
        router.push(basePath);
      }
    }
  }, [activeModal, modalConfigs, router]);

  return {
    activeModal,
    openModal,
    closeModal
  };
}