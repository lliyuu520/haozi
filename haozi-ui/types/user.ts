// 用户接口，匹配后端 SysUserVO
export interface User {
  id: string;
  username: string;
  password?: string; // 敏感信息，通常不在列表中返回
  enabled: boolean; // 是否启用
  createTime?: string;
  updateTime?: string;
  roleIdList?: string[]; // 角色ID列表，匹配后端SysUserVO
}

// 用户表单值类型，匹配后端 SysUserDTO
export interface UserFormValues {
  username: string;
  password?: string; // 创建时必填，更新时可选
  enabled: boolean;
  roleIdList?: string[]; // 角色ID列表，匹配后端SysUserDTO
}

// 用户创建参数，匹配后端 SysUserDTO
export interface UserCreateParams {
  username: string;
  password: string;
  enabled: boolean;
  roleIdList?: string[];
}

// 用户更新参数，匹配后端 SysUserDTO
export interface UserUpdateParams extends Omit<UserCreateParams, 'password'> {
  id: string;
  password?: string; // 更新密码时可选
}

// 用户查询参数，匹配后端 SysUserQuery
export interface UserQueryParams {
  username?: string;
  phone?: string;
  enabled?: boolean;
  current?: number;
  pageSize?: number;
}

// 用户分页响应，匹配后端 PageVO
export interface UserPageResponse {
  list: User[];
  total: number;
  current: number;
  pageSize: number;
}

// 重置密码参数
export interface ResetPasswordParams {
  newPassword: string;
}

// 角色选项
export interface RoleOption {
  id: string;
  name: string;
  key: string;
  title: string;
}