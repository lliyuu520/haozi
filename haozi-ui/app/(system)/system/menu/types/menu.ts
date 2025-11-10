// 菜单类型枚举 - 对应后端 MenuTypeEnum
export enum MenuType {
  MENU = 0,      // 菜单
  BUTTON = 1,   // 按钮
  INTERFACE = 2, // 接口
}

// 打开方式枚举 - 对应后端 openStyle
export enum OpenStyle {
  INTERNAL = 0,  // 内部打开
  EXTERNAL = 1,  // 外部打开
}

// 菜单项类型 - 完全对应后端 SysMenu 实体
export interface MenuItem {
  // BaseEntity 字段
  id: string;              // 改为字符串类型，避免精度丢失
  createTime?: string;
  updateTime?: string;
  creator?: number;
  updater?: number;
  deleted?: number;

  // SysMenu 字段
  parentId: string;         // 改为字符串类型，支持大数字ID
  name: string;
  url?: string;
  perms?: string;
  type: MenuType;
  openStyle: OpenStyle;
  weight: number;
  icon?: string;
  hidden?: number;        // 新增字段：0-显示，1-隐藏

  // 前端扩展字段
  path?: string;           // 从 url 映射
  component?: string;      // 前端组件路径
  visible?: boolean;      // 是否可见（从 hidden 字段映射）
  children?: MenuItem[];   // 子菜单（树形结构）

  // meta 信息（从其他字段映射）
  meta?: {
    title: string;        // 从 name 映射
    icon?: string;        // 从 icon 映射
    hidden?: boolean;     // 从 hidden 字段映射
    cache?: boolean;      // 缓存标识
    permission?: string[]; // 从 perms 解析（逗号分隔转数组）
    target?: '_blank' | '_self'; // 从 openStyle 映射
    affix?: boolean;      // 是否固定标签页
  };
}

// 菜单状态
export interface MenuState {
  menus: MenuItem[];
  openKeys: string[];
  selectedKeys: string[];
  collapsed: boolean;
}

// 后端菜单原始数据类型（对应后端直接返回的数据）
export interface RawMenuNode {
  id: number;
  parentId: number;
  name: string;
  url?: string;
  perms?: string;
  type: number;
  openStyle: number;
  weight: number;
  createTime?: string;
  updateTime?: string;
  creator?: number;
  updater?: number;
  deleted?: number;
  children?: RawMenuNode[];
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
  };
}

// 面包屑项类型
export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: string;
}

// 菜单表单数据类型
export interface MenuFormValues {
  parentId: string;        // 表单使用字符串类型，便于TreeSelect
  name: string;
  url?: string;
  perms?: string;
  type: MenuType;
  openStyle: OpenStyle;
  icon?: string;
  weight: number;
  hidden?: boolean;       // 表单使用boolean类型，便于Switch组件
  // Meta配置字段
  meta?: {
    deeplink?: boolean;
    keepAlive?: boolean;
    modal?: {
      present?: string;
      width?: number;
    };
  };
}

// 菜单树选择节点类型
export interface MenuTreeSelectNode {
  title: string;
  key: string;
  value: string;
  children?: MenuTreeSelectNode[];
}

// 弹窗展示方式选项
export const MODAL_PRESENT_OPTIONS = [
  { label: '默认', value: 'default' },
  { label: '抽屉', value: 'drawer' },
  { label: '弹窗', value: 'modal' },
  { label: '全屏', value: 'fullscreen' },
] as const;

export type ModalPresentType = typeof MODAL_PRESENT_OPTIONS[number]['value'];

// URL格式验证接口
export interface UrlValidationResult {
  isValid: boolean;
  message?: string;
  normalizedUrl?: string;
}

// 菜单导航接口
export interface MenuNavigationInfo {
  href: string;
  basePath: string;
  modal: {
    create: string;
    edit: (id: string) => string;
  };
  breadcrumbs: string[];
  modulePath: string;
}

// React风格URL配置
export const REACT_URL_CONFIG = {
  // 页面后缀
  PAGE_SUFFIX: '/page',
  // 模态框路径
  MODAL_PREFIX: '/modal/',
  // 支持的操作类型
  MODAL_ACTIONS: ['create', 'edit', 'view', 'delete'] as const,
  // URL格式正则
  URL_PATTERN: /^[a-zA-Z][a-zA-Z0-9_-]*(\/[a-zA-Z][a-zA-Z0-9_-]*)*\/page$/,
  // 路径名称映射
  PATH_NAME_MAP: {
    'system': '系统管理',
    'menu': '菜单管理',
    'user': '用户管理',
    'role': '角色管理',
    'dashboard': '仪表板',
    'profile': '个人中心',
    'settings': '系统设置',
    'monitor': '系统监控',
    'log': '日志管理',
    'config': '参数配置'
  } as const
} as const;

// 菜单转换工具函数
export class MenuUtils {
  /**
   * 将后端原始菜单数据转换为前端MenuItem
   */
  static transformRawMenu(raw: RawMenuNode): MenuItem {
    const menu: MenuItem = {
      // BaseEntity 字段
      id: String(raw.id),
      createTime: raw.createTime,
      updateTime: raw.updateTime,
      creator: raw.creator,
      updater: raw.updater,
      deleted: raw.deleted,

      // SysMenu 字段
      parentId: String(raw.parentId || '0'),
      name: raw.name || '',
      url: raw.url || '',
      perms: raw.perms || '',
      type: raw.type as MenuType,
      openStyle: raw.openStyle as OpenStyle,
      weight: raw.weight,

      // 前端扩展字段
      path: raw.url,
      component: raw.extra?.component,
      icon: raw.extra?.icon,
      visible: raw.extra?.visible !== false, // 默认可见

      // meta 信息映射
      meta: {
        title: raw.name,
        icon: raw.extra?.icon,
        hidden: raw.extra?.hidden || false,
        cache: raw.extra?.cache || false,
        permission: raw.perms ? raw.perms.split(',').filter(p => p.trim()) : [],
        target: raw.openStyle === 1 ? '_blank' : '_self',
        affix: raw.extra?.affix || false,
      },

      // 子菜单递归转换
      children: raw.children?.map(child => this.transformRawMenu(child)),
    };

    return menu;
  }











}