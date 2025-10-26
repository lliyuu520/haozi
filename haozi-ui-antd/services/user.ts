import { request } from '@/lib/api';

// 用户查询参数
export interface UserQuery {
  page?: number;
  limit?: number;
  username?: string;
  phone?: string;
  status?: number;
}

// 用户响应数据
export interface UserVO {
  id: number;
  username: string;
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status?: number;
  createTime?: string;
  roleName?: string;
  roleIdList?: number[];
}

// 用户创建参数
export interface UserCreateParams {
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  password: string;
  status?: number;
  roleIdList: number[];
  avatar?: string;
}

// 用户更新参数
export interface UserUpdateParams {
  id: number;
  nickname?: string;
  email?: string;
  phone?: string;
  status?: number;
  roleIdList?: number[];
  password?: string;
  avatar?: string;
  username?: string;
}

// 分页查询用户
export const getUserPage = (params: UserQuery) => {
  return request.get<{ list: UserVO[]; total: number }>('/sys/user/page', params);
};

// 获取用户详情
export const getUserDetail = (id: number) => {
  return request.get<UserVO>(`/sys/user/${id}`);
};

// 创建用户
export const createUser = (params: UserCreateParams) => {
  return request.post<boolean>('/sys/user', params);
};

// 更新用户
export const updateUser = (params: UserUpdateParams) => {
  return request.put<boolean>('/sys/user', params);
};

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete<boolean>('/sys/user', { id });
};
