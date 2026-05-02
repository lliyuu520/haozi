import { api } from '@/utils/request';

export type MenuType = 0 | 1 | 2;

export type MenuResource = {
  id: number;
  parentId: number;
  parentName: string;
  name: string;
  type: MenuType;
  url: string;
  icon: string;
  perms: string;
  openStyle: number;
  weight: number;
  children: MenuResource[];
};

export type MenuPayload = {
  parentId: number;
  name: string;
  type: MenuType;
  url: string;
  icon: string;
  perms: string;
  openStyle: number;
  weight: number;
};

/**
 * 查询菜单资源树。
 *
 * @returns 菜单资源树
 */
export function listMenus() {
  return api.get<MenuResource[]>('/system/menus');
}

/**
 * 查询菜单资源详情。
 *
 * @param id 菜单 ID
 * @returns 菜单资源详情
 */
export function getMenu(id: number) {
  return api.get<MenuResource>(`/system/menus/${id}`);
}

/**
 * 新增菜单资源。
 *
 * @param payload 菜单资源表单
 */
export function createMenu(payload: MenuPayload) {
  return api.post<void, MenuPayload>('/system/menus', payload);
}

/**
 * 更新菜单资源。
 *
 * @param id 菜单 ID
 * @param payload 菜单资源表单
 */
export function updateMenu(id: number, payload: MenuPayload) {
  return api.put<void, MenuPayload>(`/system/menus/${id}`, payload);
}

/**
 * 删除菜单资源。
 *
 * @param id 菜单 ID
 */
export function deleteMenu(id: number) {
  return api.delete<void>(`/system/menus/${id}`);
}
