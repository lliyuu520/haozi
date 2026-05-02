import { api } from '@/utils/request';
import type { PageResult } from '@/types/page';

export type RoleRecord = {
  id: number;
  name: string;
  menuIdList: number[];
};

export type MenuTreeNode = {
  id: number;
  name: string;
  children: MenuTreeNode[];
};

export type RoleQuery = {
  name?: string;
  page: number;
  pageSize: number;
};

export type RolePayload = {
  name: string;
  menuIdList: number[];
};

/**
 * 查询角色分页。
 *
 * @param query 查询条件和分页参数
 * @returns 角色分页数据
 */
export function listRoles(query: RoleQuery) {
  return api.get<PageResult<RoleRecord>>('/system/roles', { params: query });
}

/**
 * 查询角色详情。
 *
 * @param id 角色 ID
 * @returns 角色详情
 */
export function getRole(id: number) {
  return api.get<RoleRecord>(`/system/roles/${id}`);
}

/**
 * 查询菜单权限树。
 *
 * @returns 菜单权限树
 */
export function getRoleMenuTree() {
  return api.get<MenuTreeNode[]>('/system/roles/menu-tree');
}

/**
 * 新增角色。
 *
 * @param payload 角色表单
 */
export function createRole(payload: RolePayload) {
  return api.post<void, RolePayload>('/system/roles', payload);
}

/**
 * 更新角色。
 *
 * @param id 角色 ID
 * @param payload 角色表单
 */
export function updateRole(id: number, payload: RolePayload) {
  return api.put<void, RolePayload>(`/system/roles/${id}`, payload);
}

/**
 * 删除角色。
 *
 * @param id 角色 ID
 */
export function deleteRole(id: number) {
  return api.delete<void>(`/system/roles/${id}`);
}
