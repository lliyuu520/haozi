'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { RouteHelper } from '@/utils/routeHelper';

// 历史记录项
interface HistoryItem {
  path: string;
  type: 'page' | 'modal';
  basePath?: string;
  action?: string;
  id?: string;
  timestamp: number;
}

// 模态框历史配置
export interface ModalHistoryConfig {
  // 最大历史记录数量
  maxHistorySize?: number;
  // 是否启用自动清理
  enableAutoCleanup?: boolean;
  // 清理间隔（毫秒）
  cleanupInterval?: number;
  // 历史记录过期时间（毫秒）
  historyExpiration?: number;
  // 是否监听浏览器后退事件
  listenToPopState?: boolean;
  // 自定义后退处理
  customBackHandler?: (from: HistoryItem, to: HistoryItem) => boolean;
}

/**
 * 模态框历史管理Hook
 * 优化模态框的浏览器历史记录和后退行为
 */
export function useModalHistory(config: ModalHistoryConfig = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    maxHistorySize = 50,
    enableAutoCleanup = true,
    cleanupInterval = 60000, // 1分钟
    historyExpiration = 1800000, // 30分钟
    listenToPopState = true,
    customBackHandler
  } = config;

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const historyRef = useRef<HistoryItem[]>([]);
  const currentIndexRef = useRef(-1);
  const cleanupTimerRef = useRef<NodeJS.Timeout>();

  // 同步内部ref和state
  useEffect(() => {
    historyRef.current = history;
    currentIndexRef.current = currentIndex;
  }, [history, currentIndex]);

  // 解析当前路径信息
  const parseCurrentPath = useCallback((): HistoryItem | null => {
    const modalMatch = pathname.match(/\/(.+?)\/modal\/(.+?)(?:\/(.+))?$/);

    if (modalMatch) {
      const [, basePath, action, id] = modalMatch;
      return {
        path: pathname,
        type: 'modal' as const,
        basePath,
        action,
        id,
        timestamp: Date.now()
      };
    }

    if (pathname.endsWith('/page')) {
      return {
        path: pathname,
        type: 'page' as const,
        basePath: pathname.replace('/page', ''),
        timestamp: Date.now()
      };
    }

    return {
      path: pathname,
      type: 'page' as const,
      timestamp: Date.now()
    };
  }, [pathname]);

  // 添加历史记录项
  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => {
      const newHistory = [...prev];

      // 如果当前不是最新的，移除后面的历史记录
      if (currentIndexRef.current < newHistory.length - 1) {
        newHistory.splice(currentIndexRef.current + 1);
      }

      // 添加新记录
      newHistory.push(item);

      // 限制历史记录大小
      if (newHistory.length > maxHistorySize) {
        newHistory.splice(0, newHistory.length - maxHistorySize);
      }

      return newHistory;
    });

    setCurrentIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
  }, [maxHistorySize]);

  // 清理过期历史记录
  const cleanupHistory = useCallback(() => {
    const now = Date.now();
    setHistory(prev => prev.filter(item => now - item.timestamp < historyExpiration));
  }, [historyExpiration]);

  // 获取上一个历史记录项
  const getPreviousItem = useCallback((): HistoryItem | null => {
    if (currentIndexRef.current <= 0) {
      return null;
    }

    return historyRef.current[currentIndexRef.current - 1];
  }, []);

  // 获取下一个历史记录项
  const getNextItem = useCallback((): HistoryItem | null => {
    if (currentIndexRef.current >= historyRef.current.length - 1) {
      return null;
    }

    return historyRef.current[currentIndexRef.current + 1];
  }, []);

  // 处理浏览器后退事件
  const handlePopState = useCallback(() => {
    if (!listenToPopState) {
      return;
    }

    const current = parseCurrentPath();
    if (!current) {
      return;
    }

    const previous = getPreviousItem();
    if (!previous) {
      return;
    }

    // 自定义后退处理
    if (customBackHandler) {
      const handled = customBackHandler(current, previous);
      if (handled) {
        return;
      }
    }

    // 默认后退处理逻辑
    if (current.type === 'modal' && previous.type === 'page') {
      // 从模态框后退到页面
      const basePath = previous.basePath || 'system';
      const pagePath = RouteHelper.generateRoute(`${basePath}/page`);

      // 阻止默认行为，手动导航
      window.history.pushState(null, '', pagePath);
      router.push(pagePath);
    } else if (current.type === 'modal' && previous.type === 'modal') {
      // 从一个模态框后退到另一个模态框
      if (previous.basePath && previous.action) {
        const modalPath = RouteHelper.generateModalRoute(
          `${previous.basePath}/page`,
          previous.action,
          previous.id
        );

        // 阻止默认行为，手动导航
        window.history.pushState(null, '', modalPath);
        router.push(modalPath);
      }
    }
  }, [
    listenToPopState,
    parseCurrentPath,
    getPreviousItem,
    customBackHandler,
    router
  ]);

  // 手动后退
  const goBack = useCallback(() => {
    const previous = getPreviousItem();
    if (!previous) {
      // 如果没有历史记录，回到首页
      router.push('/dashboard');
      return;
    }

    if (previous.type === 'page') {
      const pagePath = previous.path;
      router.push(pagePath);
    } else if (previous.type === 'modal' && previous.basePath) {
      const modalPath = RouteHelper.generateModalRoute(
        `${previous.basePath}/page`,
        previous.action || 'view',
        previous.id
      );
      router.push(modalPath);
    }
  }, [getPreviousItem, router]);

  // 手动前进
  const goForward = useCallback(() => {
    const next = getNextItem();
    if (!next) {
      return;
    }

    router.push(next.path);
  }, [getNextItem, router]);

  // 关闭模态框并返回到基础页面
  const closeModalAndReturn = useCallback((basePath?: string) => {
    const targetBasePath = basePath || parseCurrentPath()?.basePath;
    if (!targetBasePath) {
      router.push('/dashboard');
      return;
    }

    const pagePath = RouteHelper.generateRoute(`${targetBasePath}/page`);
    router.push(pagePath);
  }, [parseCurrentPath, router]);

  // 智能后退：根据当前状态决定后退行为
  const smartBack = useCallback(() => {
    const current = parseCurrentPath();
    if (!current) {
      router.push('/dashboard');
      return;
    }

    if (current.type === 'modal') {
      // 当前是模态框，关闭模态框
      closeModalAndReturn(current.basePath);
    } else {
      // 当前是页面，执行普通后退
      goBack();
    }
  }, [parseCurrentPath, closeModalAndReturn, goBack, router]);

  // 检查是否可以后退
  const canGoBack = useCallback((): boolean => {
    return currentIndexRef.current > 0 || window.history.length > 1;
  }, []);

  // 检查是否可以前进
  const canGoForward = useCallback((): boolean => {
    return currentIndexRef.current < historyRef.current.length - 1;
  }, []);

  // 监听路径变化
  useEffect(() => {
    const current = parseCurrentPath();
    if (current) {
      // 检查是否与当前历史记录中的最后一项相同
      const lastItem = historyRef.current[historyRef.current.length - 1];
      if (!lastItem || lastItem.path !== current.path) {
        addToHistory(current);
      }
    }
  }, [parseCurrentPath, addToHistory]);

  // 监听浏览器后退事件
  useEffect(() => {
    if (listenToPopState) {
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [listenToPopState, handlePopState]);

  // 自动清理过期历史记录
  useEffect(() => {
    if (enableAutoCleanup) {
      cleanupTimerRef.current = setInterval(cleanupHistory, cleanupInterval);
      return () => {
        if (cleanupTimerRef.current) {
          clearInterval(cleanupTimerRef.current);
        }
      };
    }
  }, [enableAutoCleanup, cleanupInterval, cleanupHistory]);

  // 页面卸载时清理
  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current) {
        clearInterval(cleanupTimerRef.current);
      }
    };
  }, []);

  return {
    // 状态
    history,
    currentIndex,
    currentItem: parseCurrentPath(),
    previousItem: getPreviousItem(),
    nextItem: getNextItem(),

    // 操作方法
    goBack,
    goForward,
    smartBack,
    closeModalAndReturn,

    // 状态检查
    canGoBack,
    canGoForward,

    // 工具方法
    addToHistory,
    cleanupHistory,
    isModalOpen: parseCurrentPath()?.type === 'modal'
  };
}

/**
 * 简化版模态框历史Hook
 * 只关注基本的模态框后退行为
 */
export function useSimpleModalHistory() {
  const router = useRouter();
  const pathname = usePathname();

  const isModalOpen = pathname.includes('/modal/');

  const closeModal = useCallback(() => {
    // 提取基础路径
    const basePath = pathname.replace(/\/modal\/.*$/, '');
    const pagePath = RouteHelper.generateRoute(`${basePath}/page`);
    router.push(pagePath);
  }, [pathname, router]);

  const goBack = useCallback(() => {
    if (isModalOpen) {
      closeModal();
    } else {
      router.back();
    }
  }, [isModalOpen, closeModal, router]);

  return {
    isModalOpen,
    closeModal,
    goBack,
    canGoBack: isModalOpen || window.history.length > 1
  };
}

/**
 * 键盘快捷键Hook
 * 为模态框添加ESC键关闭和快捷键支持
 */
export function useModalKeyboardShortcuts(config: {
  onClose?: () => void;
  onBack?: () => void;
  enabled?: boolean;
} = {}) {
  const { onClose, onBack, enabled = true } = config;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC键关闭模态框
      if (event.key === 'Escape') {
        if (onClose) {
          onClose();
        } else {
          window.history.back();
        }
      }

      // Alt + 左箭头后退
      if (event.altKey && event.key === 'ArrowLeft') {
        if (onBack) {
          onBack();
        } else {
          window.history.back();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onClose, onBack]);
}