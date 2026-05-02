import { api } from '@/utils/request';

export type NavigationMenuNode = {
  id: number;
  parentId: number;
  parentName: string;
  name: string;
  type: number;
  url: string;
  icon: string;
  openStyle: number;
  weight: number;
  children: NavigationMenuNode[];
};

/**
 * 查询当前登录用户可访问的导航菜单树。
 *
 * @returns 当前用户导航菜单树
 */
export function listNavigationMenus() {
  return api.get<NavigationMenuNode[]>('/system/menus/navigation');
}
