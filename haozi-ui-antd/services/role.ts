import { request } from '@/lib/api';

export interface RoleQuery {
  page?: number;
  limit?: number;
  name?: string;
}

export interface RoleVO {
  id: number;
  name: string;
  remark?: string;
  menuIdList?: number[];
  createTime?: string;
}

export interface RoleCreateParams {
  name: string;
  remark?: string;
  menuIdList?: number[];
}

export interface RoleUpdateParams extends RoleCreateParams {
  id: number;
}

export const getRolePage = (params: RoleQuery) => {
  return request.get<{ list: RoleVO[]; total: number }>('/sys/role/page', params);
};

export const getRoleList = () => {
  return request.get<RoleVO[]>('/sys/role/list');
};

export const getRoleDetail = (id: number) => {
  return request.get<RoleVO>(`/sys/role/${id}`);
};

export const createRole = (params: RoleCreateParams) => {
  return request.post<boolean>('/sys/role', params);
};

export const updateRole = (params: RoleUpdateParams) => {
  return request.put<boolean>('/sys/role', params);
};

export const deleteRole = (id: number) => {
  return request.delete<boolean>('/sys/role', { id });
};
