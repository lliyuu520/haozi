export interface SysUser {
  id: string
  username: string
  password?: string
  realName?: string
  email?: string
  phone?: string
  status?: number
  avatar?: string
  createTime: string
  updateTime?: string
  creator?: string
  updater?: string
  deleted?: number
  roleIdList?: number[]
}

export interface SysUserQuery {
  username?: string
  page?: number
  limit?: number
}

export interface SysUserDTO extends SysUser {
  roleIdList?: number[]
}

export interface SysUserVO extends SysUser {
  roleIdList?: number[]
}

export interface SysUserPasswordDTO {
  oldPassword?: string
  newPassword: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  limit: number
}