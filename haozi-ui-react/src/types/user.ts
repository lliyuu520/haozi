export interface UserInfo {
  id: string
  username: string
  avatar: string
  email: string
  phone: string
  status: number
  createTime?: string
  updateTime?: string
}

export interface AuthorityItem {
  id: string
  authority: string
  description: string
}

export interface LoginForm {
  username: string
  password: string
  captcha?: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface ChangePasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UserQuery {
  username?: string
  status?: number
  page?: number
  limit?: number
}

export interface UserDTO {
  id?: string
  username: string
  password?: string
  email: string
  phone: string
  status: number
  roleIds: string[]
}

export interface UserVO {
  id: string
  username: string
  email: string
  phone: string
  status: number
  statusText: string
  createTime: string
  roles: RoleVO[]
}

export interface RoleVO {
  id: string
  roleName: string
  roleKey: string
  description: string
  status: number
  createTime: string
}

export interface PageVO<T> {
  list: T[]
  total: number
  page: number
  limit: number
}

export interface Result<T = any> {
  code: number
  msg: string
  data: T
}