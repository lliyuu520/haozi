import { QueryClient } from '@tanstack/react-query';

/**
 * 全局服务端状态客户端。
 *
 * 后台系统大部分数据来自服务端，默认不在窗口聚焦时自动重拉，避免用户编辑表单时被刷新打断。
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
    mutations: {
      retry: false,
    },
  },
});
