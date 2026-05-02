import { useQuery } from '@tanstack/react-query';
import { listNavigationMenus } from '@/app/navigation/api';
import { buildNavigationRoutes } from '@/app/navigation/navigation';

export const NAVIGATION_MENU_QUERY_KEY = ['system', 'navigation-menus'] as const;

/**
 * 当前用户动态导航菜单查询。
 *
 * 侧栏、标签页和占位页共享同一个查询缓存，避免多个布局组件重复维护菜单状态。
 */
export function useNavigationMenus() {
  return useQuery({
    queryKey: NAVIGATION_MENU_QUERY_KEY,
    queryFn: listNavigationMenus,
    select: buildNavigationRoutes,
    staleTime: 5 * 60 * 1000,
  });
}
