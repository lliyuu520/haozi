import { useAuthStore } from '@/store/authStore';

/**
 * 判断当前用户是否拥有指定权限码。
 *
 * @param code 权限码，例如 sys:user:save
 * @returns 是否拥有权限
 */
export function useAuth(code: string) {
  return useAuthStore(state => state.permissions.includes('*') || state.permissions.includes(code));
}
