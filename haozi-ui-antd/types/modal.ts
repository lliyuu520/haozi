// 路由弹窗类型定义

// 弹窗路由模式
export type ModalRouteMode = 'path' | 'query';

// 路由弹窗配置
export interface RouteModalConfig {
  mode: ModalRouteMode;
  pathPrefix?: string;
  queryParam?: string;
  title?: string;
  width?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
}

// 弹窗参数
export interface ModalParams extends Record<string, string | number | boolean> {
  modal: string;
  [key: string]: string | number | boolean;
}

// 用户管理弹窗类型
export const USER_MODAL_TYPES = {
  CREATE: 'create-modal',
  EDIT: 'edit-modal',
  VIEW: 'view-modal',
} as const;

export type UserModalType = typeof USER_MODAL_TYPES[keyof typeof USER_MODAL_TYPES];

// 角色管理弹窗类型
export const ROLE_MODAL_TYPES = {
  CREATE: 'create-modal',
  EDIT: 'edit-modal',
  VIEW: 'view-modal',
} as const;

export type RoleModalType = typeof ROLE_MODAL_TYPES[keyof typeof ROLE_MODAL_TYPES];

// 菜单管理弹窗类型
export const MENU_MODAL_TYPES = {
  CREATE: 'create-modal',
  EDIT: 'edit-modal',
  VIEW: 'view-modal',
} as const;

export type MenuModalType = typeof MENU_MODAL_TYPES[keyof typeof MENU_MODAL_TYPES];

// 菜单弹窗配置类型（对应后端SysMenu.Meta.Modal）
export interface MenuModalConfig {
  present?: string;  // 弹窗展示方式
  width?: number;    // 弹窗宽度
}

// 菜单元数据配置（对应后端SysMenu.Meta）
export interface MenuMetaConfig {
  deeplink?: boolean;
  keepAlive?: boolean;
  modal?: MenuModalConfig;
}

// 弹窗路由映射配置
export const MODAL_ROUTES = {
  USER: {
    BASE: '/system/user',
    CREATE: '/system/user/modal/create',
    EDIT: '/system/user/modal/edit/:id',
    VIEW: '/system/user/modal/view/:id',
  },
  ROLE: {
    BASE: '/system/role',
    CREATE: '/system/role/modal/create',
    EDIT: '/system/role/modal/edit/:id',
    VIEW: '/system/role/modal/view/:id',
  },
  MENU: {
    BASE: '/system/menu',
    CREATE: '/system/menu/modal/create',
    EDIT: '/system/menu/modal/edit/:id',
    VIEW: '/system/menu/modal/view/:id',
  },
} as const;