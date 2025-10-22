export interface SysMenu {
  id: string
  parentId: string
  weight: number
  name: string
  parentName?: string
  openStyle?: number
  icon?: string
  url?: string
  perms?: string
  type: number
  status: number
  children?: SysMenu[]
  createTime?: string
  updateTime?: string
}

export interface SysMenuQuery {
  name?: string
  type?: number
  status?: number
}

export interface SysMenuDTO extends SysMenu {
  children?: SysMenu[]
}

export interface SysMenuTree {
  id: string
  parentId: string
  name: string
  title: string
  key: string
  weight: number
  url?: string
  perms?: string
  type: number
  status: number
  icon?: string
  children?: SysMenuTree[]
}

export interface MenuTreeItem {
  id: string
  menuName: string
  parentId: string
  menuType: string
  path: string
  component: string
  perms: string
  icon: string
  orderNum: number
  status: number
  visible: number
  isFrame: number
  children?: MenuTreeItem[]
}
