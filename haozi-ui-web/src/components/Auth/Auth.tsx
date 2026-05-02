import type { PropsWithChildren } from 'react';
import { useAuth } from '@/hooks/useAuth';

type AuthProps = PropsWithChildren<{
  code: string;
}>;

/**
 * 按钮级权限组件。
 *
 * 没有权限时直接不渲染子节点，不保留空占位，保证页面操作区语义清晰。
 */
export function Auth({ code, children }: AuthProps) {
  const allowed = useAuth(code);
  return allowed ? children : null;
}
