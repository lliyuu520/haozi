import type { PropsWithChildren } from 'react';
import { ForbiddenPage } from '@/features/system/ForbiddenPage';
import { useAuthStore } from '@/store/authStore';

type RouteAccessGuardProps = PropsWithChildren<{
  code: string;
}>;

/**
 * 页面级路由访问守卫。
 *
 * routes.tsx 只声明前端可加载页面，真正能否进入页面仍以 /auth/me 返回的 routeCodes 为准。
 */
export function RouteAccessGuard({ code, children }: RouteAccessGuardProps) {
  const allowed = useAuthStore(state => state.routeCodes.includes('*') || state.routeCodes.includes(code));

  if (!allowed) {
    return <ForbiddenPage />;
  }

  return children;
}
