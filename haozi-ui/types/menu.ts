// 菜单类型与字段定义（与后端 SysMenu 接口对齐）

export enum MenuType {
  MENU = 0,      // 菜单
  BUTTON = 1,    // 按钮
  INTERFACE = 2, // 接口/目录
}

export enum OpenStyle {
  INTERNAL = 0, // 内部打开
  EXTERNAL = 1, // 外部链接
}

export const PRESENT_TYPE_DICT = {
  default: '默认',
  drawer: '抽屉',
  modal: '弹窗',
  fullscreen: '全屏',
} as const;

export type PresentType = keyof typeof PRESENT_TYPE_DICT;
export type ModalPresentType = PresentType;

export interface MenuMeta {
  deeplink?: boolean;
  keepAlive?: boolean;
  modal?: {
    present?: ModalPresentType;
    width?: number;
  };
}

export interface MenuTreeMeta extends MenuMeta {
  title?: string;
  icon?: string;
  hidden?: boolean;
  cache?: boolean;
  permission?: string[];
  target?: '_blank' | '_self';
  affix?: boolean;
}

export interface MenuItem {
  id: string;
  createTime?: string;
  updateTime?: string;
  creator?: number;
  updater?: number;
  deleted?: number;

  parentId: string;
  name: string;
  url?: string;
  perms?: string;
  type: MenuType;
  openStyle: OpenStyle;
  weight: number;
  icon?: string;
  hidden?: boolean;
  meta?: MenuMeta;
}

export type MenuTreeNode = Omit<MenuItem, 'meta'> & {
  parentName?: string;
  path?: string;
  component?: string;
  visible?: boolean;
  children?: MenuTreeNode[];
  meta?: MenuTreeMeta;
};

export interface MenuState {
  menus: MenuTreeNode[];
  openKeys: string[];
  selectedKeys: string[];
  collapsed: boolean;
}

// 后端菜单原始节点（/sys/menu/nav 等接口返回）
export interface RawMenuNode {
  id?: number | string;
  parentId?: number | string;
  name?: string;
  url?: string;
  perms?: string;
  type?: number;
  openStyle?: number;
  weight?: number;
  createTime?: string;
  updateTime?: string;
  creator?: number;
  updater?: number;
  deleted?: number;
  children?: RawMenuNode[];
  icon?: string;
  extra?: {
    title?: string;
    icon?: string;
    hidden?: boolean;
    cache?: boolean;
    permission?: string[];
    target?: '_blank' | '_self';
    affix?: boolean;
    visible?: boolean;
    component?: string;
    deeplink?: boolean;
    keepAlive?: boolean;
    modal?: {
      present?: ModalPresentType;
      width?: number;
    };
    weight?: number;
    type?: number | string;
    perms?: string;
    url?: string;
    name?: string;
  };
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: string;
}

export interface MenuFormValues {
  parentId: string;
  name: string;
  url?: string;
  perms?: string;
  type: MenuType;
  openStyle: OpenStyle;
  icon?: string;
  weight: number;
  hidden?: boolean;
  meta?: {
    deeplink?: boolean;
    keepAlive?: boolean;
    modal?: {
      present?: ModalPresentType;
      width?: number;
    };
  };
}

export interface MenuTreeSelectNode {
  title: string;
  key: string;
  value: string;
  children?: MenuTreeSelectNode[];
}

export const MODAL_PRESENT_OPTIONS = Object.entries(PRESENT_TYPE_DICT).map(
  ([value, label]) => ({
    label,
    value: value as PresentType,
  }),
) as Array<{ label: string; value: PresentType }>;
