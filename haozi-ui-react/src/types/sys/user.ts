
export interface SysUser {
  id: number
  username: string
  password: string
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
