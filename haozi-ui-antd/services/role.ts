import { request } from '@/lib/api';
import { withErrorHandling } from '@/lib/apiUtils';

export interface RoleQuery {
  page?: number;
  limit?: number;
  name?: string;
}

export interface RoleVO {
  id: string;              // 改为字符串类型，避免精度丢失
  name: string;
  remark?: string;
  menuIdList?: string[];    // 改为字符串类型
  createTime?: string;
}

export interface RoleCreateParams {
  name: string;
  remark?: string;
  menuIdList?: string[];    // 改为字符串类型
}

export interface RoleUpdateParams extends RoleCreateParams {
  id: string;              // 改为字符串类型
}

export const getRolePage = (params: RoleQuery) => {
  return withErrorHandling(
    request.get<{ list: RoleVO[]; total: number }>('/sys/role/page', params),
    '获取角色列表'
  );
};

export const getRoleList = () => {
  return withErrorHandling(
    request.get<RoleVO[]>('/sys/role/list'),
    '获取所有角色'
  );
};

export const getRoleDetail = (id: number) => {
  return withErrorHandling(
    request.get<RoleVO>(`/sys/role/${id}`),
    '获取角色详情'
  );
};

export const createRole = (params: RoleCreateParams) => {
  return withErrorHandling(
    request.post<boolean>('/sys/role', params),
    '创建角色'
  );
};

export const updateRole = (params: RoleUpdateParams) => {
  return withErrorHandling(
    request.put<boolean>('/sys/role', params),
    '更新角色'
  );
};

export const deleteRole = (id: number) => {
  return withErrorHandling(
    request.delete<boolean>('/sys/role', { id }),
    '删除角色'
  );
};
