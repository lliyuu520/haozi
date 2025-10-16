export interface SysRole {
  id: number
  name: string
  code?: string
  remark?: string
  sort?: number
  status?: number
  menuIdList?: number[]
  tableFieldIdList?: number[]
  createTime?: string
  updateTime?: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  limit: number
}

export interface SysRoleQuery {
  name?: string
  code?: string
  status?: number
  page?: number
  limit?: number
  order?: string
  asc?: boolean
}

export interface SysRoleDTO {
  id?: number
  name: string
  code?: string
  remark?: string
  sort?: number
  status?: number
  menuIdList?: number[]
  tableFieldIdList?: number[]
}

export interface SysRoleVO extends SysRole {
  menus?: SysMenu[]
}

export interface SysMenu {
  id: number
  pid: number
  name: string
  icon?: string
  url?: string
  perms?: string
  type: number
  sort: number
  status: number
  children?: SysMenu[]
}

export interface SysDept {
  id: string
  pid: string
  name: string
  sort: number
  status: number
  children?: SysDept[]
}