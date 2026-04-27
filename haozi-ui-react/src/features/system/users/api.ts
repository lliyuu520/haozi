import { api } from '@/utils/request';
import type { PageResult } from '@/types/page';

export type UserRecord = {
  id: number;
  username: string;
  roleIdList: number[];
};

export type RoleOption = {
  id: number;
  name: string;
};

export type UserQuery = {
  username?: string;
  page: number;
  pageSize: number;
};

export type UserPayload = {
  username: string;
  password?: string;
  roleIdList: number[];
};

export type PasswordPayload = {
  newPassword: string;
};

/**
 * 查询用户分页。
 *
 * @param query 查询条件和分页参数
 * @returns 用户分页数据
 */
export function listUsers(query: UserQuery) {
  return api.get<PageResult<UserRecord>>('/system/users', { params: query });
}

/**
 * 查询用户表单需要的角色选项。
 *
 * @returns 角色选项列表
 */
export function listRoleOptions() {
  return api.get<RoleOption[]>('/system/users/role-options');
}

/**
 * 新增用户。
 *
 * @param payload 用户表单
 */
export function createUser(payload: UserPayload) {
  return api.post<void, UserPayload>('/system/users', payload);
}

/**
 * 更新用户。
 *
 * @param id 用户 ID
 * @param payload 用户表单
 */
export function updateUser(id: number, payload: UserPayload) {
  return api.put<void, UserPayload>(`/system/users/${id}`, payload);
}

/**
 * 删除用户。
 *
 * @param id 用户 ID
 */
export function deleteUser(id: number) {
  return api.delete<void>(`/system/users/${id}`);
}
