import { request } from '@/lib/api';
import { withErrorHandling } from '@/lib/apiUtils';

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
  id: string;              // 改为字符串类型，避免精度丢失
  username: string;
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status?: number;
  createTime?: string;
  roleName?: string;
  roleIdList?: string[];    // 也改为字符串类型
}

// 用户创建参数
export interface UserCreateParams {
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  password: string;
  status?: number;
  roleIdList: string[];    // 改为字符串类型
  avatar?: string;
}

// 用户更新参数
export interface UserUpdateParams {
  id: string;              // 改为字符串类型
  nickname?: string;
  email?: string;
  phone?: string;
  status?: number;
  roleIdList?: string[];    // 改为字符串类型
  password?: string;
  avatar?: string;
  username?: string;
}

// 分页查询用户
export const getUserPage = (params: UserQuery) => {
  return withErrorHandling(
    request.get<{ list: UserVO[]; total: number }>('/sys/user/page', params),
    '获取用户列表'
  );
};

// 获取用户详情
export const getUserDetail = (id: string) => {
  return withErrorHandling(
    request.get<UserVO>(`/sys/user/${id}`),
    '获取用户详情'
  );
};

// 创建用户
export const createUser = (params: UserCreateParams) => {
  return withErrorHandling(
    request.post<boolean>('/sys/user', params),
    '创建用户'
  );
};

// 更新用户
export const updateUser = (params: UserUpdateParams) => {
  return withErrorHandling(
    request.put<boolean>('/sys/user', params),
    '更新用户'
  );
};

// 删除用户
export const deleteUser = (id: string) => {
  return withErrorHandling(
    request.delete<boolean>('/sys/user', { id }),
    '删除用户'
  );
};
