import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/app/providers/queryClient';
import { setGlobalMessage } from '@/utils/request';

/**
 * 应用级 Provider 汇总。
 *
 * 这里集中放置 UI 主题、AntD 消息上下文和 TanStack Query，避免业务页面直接关心全局装配顺序。
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2764c5',
          colorInfo: '#2764c5',
          borderRadius: 10,
          fontFamily: '"LXGW WenKai Screen", "Source Han Sans SC", "Noto Sans CJK SC", sans-serif',
        },
      }}
    >
      <AntdApp>
        <MessageBridge />
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

/**
 * 将 AntD App 上下文中的 message 实例注入 axios 拦截器。
 *
 * 避免在非 React 上下文中使用静态 message API 导致 antd v6 弃用警告和主题丢失。
 */
function MessageBridge() {
  const { message } = AntdApp.useApp();
  useEffect(() => {
    setGlobalMessage(message);
  }, [message]);
  return null;
}
