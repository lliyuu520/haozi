import {request} from '@/lib/api';
import {API} from '@/lib/apiEndpoints';
import type {
  User,
  UserCreateParams,
  UserPageResponse,
  UserQueryParams,
  UserUpdateParams,
  ResetPasswordParams,
  RoleOption,
} from '@/types/user';

/**
 * 获取用户列表（分页）
 */
export async function getUserPage(params: UserQueryParams = {}): Promise<UserPageResponse> {
  const response = await request.get<{
    list?: User[];
    total?: number;
    current?: number;
    pageSize?: number;
  }>(API.user.page(), params as Record<string, unknown>);

  const payload = response.data?.data ?? {};
  const list = Array.isArray(payload.list) ? payload.list : [];
  const total = typeof payload.total === 'number' ? payload.total : list.length;
  const pageSize = typeof payload.pageSize === 'number' ? payload.pageSize : list.length || 20;
  const current = typeof payload.current === 'number' ? payload.current : 1;

  return {
    list,
    total,
    current,
    pageSize,
  };
}

/**
 * 获取用户列表（不分页）
 */
export async function getUserList(params: UserQueryParams = {}): Promise<User[]> {
  const response = await request.get<User[]>(API.user.list(), params as Record<string, unknown>);
  return response.data?.data ?? [];
}

/**
 * 获取用户详情
 */
export async function getUserDetail(id: string): Promise<User | null> {
  const response = await request.get<User>(API.user.detail(id));
  return response.data?.data ?? null;
}

/**
 * 创建用户
 */
export async function createUser(params: UserCreateParams): Promise<void> {
  await request.post(API.user.create(), params);
}

/**
 * 更新用户
 */
export async function updateUser(params: UserUpdateParams): Promise<void> {
  await request.put(API.user.update(), params);
}

/**
 * 删除用户
 */
export async function deleteUser(id: string): Promise<void> {
  await request.delete(API.user.delete(id));
}

/**
 * 重置用户密码
 */
export async function resetUserPassword(id: string, params: ResetPasswordParams): Promise<void> {
  await request.put('/sys/user/updatePassword', { id, newPassword: params.newPassword });
}

/**
 * 获取角色列表（用于用户分配）
 */
export async function getRoleListForUser(): Promise<RoleOption[]> {
  const response = await request.get('/sys/role/list');
  const data = response.data?.data ?? [];

  // 转换为RoleOption格式
  return data.map((role: any) => ({
    id: role.id,
    name: role.name,
    key: role.id,
    title: role.name,
  }));
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUserInfo(): Promise<User | null> {
  const response = await request.get<User>(API.user.info);
  return response.data?.data ?? null;
}

/**
 * 更新用户头像
 */
export async function updateUserAvatar(avatar: string): Promise<void> {
  await request.put(API.user.profile, { avatar });
}

/**
 * 修改密码
 */
export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await request.post('/sys/auth/change-password', {
    oldPassword,
    newPassword,
  });
}