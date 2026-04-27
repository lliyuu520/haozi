import type { PropsWithChildren } from 'react';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/app/providers/queryClient';

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
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
