import { request, ApiResponse, PageResponse } from '@/lib/api';
import { UserInfo } from '@/lib/auth';

// 用户查询参数
export interface UserQuery extends Record<string, unknown> {
  current?: number;
  size?: number;
  username?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  status?: number;
  roleId?: number;
  beginTime?: string;
  endTime?: string;
}

// 用户响应数据
export interface UserVO extends UserInfo {
  createTime?: string;
  updateTime?: string;
  status?: number;
  roleName?: string;
  roleId?: number;
  departmentName?: string;
}

// 用户创建参数
export interface UserCreateParams {
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  password: string;
  roleId?: number;
  departmentId?: number;
  status?: number;
}

// 用户更新参数
export interface UserUpdateParams {
  id: number;
  nickname?: string;
  email?: string;
  phone?: string;
  roleId?: number;
  departmentId?: number;
  status?: number;
}

// 分页查询用户
export const getUserPage = (params: UserQuery) => {
  return request.get<PageResponse<UserVO>>('/sys/user/page', params);
};

// 获取用户详情
export const getUserDetail = (id: number) => {
  return request.get<UserVO>(`/sys/user/${id}`);
};

// 创建用户
export const createUser = (params: UserCreateParams) => {
  return request.post<boolean>('/sys/user/create', params);
};

// 更新用户
export const updateUser = (params: UserUpdateParams) => {
  return request.put<boolean>('/sys/user/update', params);
};

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete<boolean>(`/sys/user/delete/${id}`);
};

// 批量删除用户
export const batchDeleteUsers = (ids: number[]) => {
  return request.post<boolean>('/sys/user/batch-delete', { ids });
};

// 修改用户状态
export const changeUserStatus = (id: number, status: number) => {
  return request.put<boolean>(`/sys/user/change-status/${id}/${status}`);
};

// 重置用户密码
export const resetPassword = (id: number) => {
  return request.put<boolean>(`/sys/user/reset-password/${id}`);
};

// 导出用户
export const exportUsers = (params: UserQuery) => {
  return request.download('/sys/user/export', params);
};

// 导入用户
export const importUsers = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.upload<boolean>('/sys/user/import', formData);
};
