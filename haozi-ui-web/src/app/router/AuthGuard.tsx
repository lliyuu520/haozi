import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from '@tanstack/react-router';
import { Spin } from 'antd';
import { api } from '@/utils/request';
import { useAuthStore } from '@/store/authStore';
import type { CurrentUser } from '@/types/auth';

/**
 * 业务路由登录态守卫。
 *
 * 首次进入应用时通过 /auth/me 恢复 Sa-Token 会话，不依赖前端本地 token。
 */
export function AuthGuard() {
  const location = useLocation();
  const { initialized, user, setCurrentUser, clear } = useAuthStore();

  useEffect(() => {
    if (initialized) {
      return;
    }

    api
      .get<CurrentUser>('/auth/me')
      .then(setCurrentUser)
      .catch(() => clear());
  }, [clear, initialized, setCurrentUser]);

  if (!initialized) {
    return (
      <div className="app-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" search={{ redirect: location.href }} replace />;
  }

  return <Outlet />;
}
