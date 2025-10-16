// 字典类型
export interface DictTypeItem {
  id: string
  dictName: string
  dictType: string
  status: number
  remark?: string
  createTime: string
}

// 字典数据
export interface DictDataItem {
  id: string
  dictType: string
  dictLabel: string
  dictValue: string
  dictSort: number
  status: number
  remark?: string
  createTime: string
}

// 完整字典数据（类型+数据）
export interface DictItem {
  dictType: string
  dictName: string
  dataList: DictDataItem[]
}

export interface SysConfigItem {
  id: string
  configKey: string
  configValue: string
  configType: string
  isSystem: number
  remark?: string
  createTime: string
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

export interface MenuItem {
  id: string
  name: string
  path: string
  component?: string
  redirect?: string
  meta: {
    title: string
    icon?: string
    hidden?: boolean
    breadcrumb?: boolean
    cache?: boolean
    affix?: boolean
  }
  children?: MenuItem[]
}