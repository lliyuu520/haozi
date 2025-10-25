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
  id: number;
  createTime?: string;
  updateTime?: string;
  creator?: number;
  updater?: number;
  deleted?: number;

  // SysMenu 字段
  parentId: number;
  name: string;
  url?: string;
  perms?: string;
  type: MenuType;
  openStyle: OpenStyle;
  weight: number;

  // 前端扩展字段
  path?: string;           // 从 url 映射
  component?: string;      // 前端组件路径
  icon?: string;          // 图标名称
  visible?: boolean;      // 是否可见（后端没有 visible 字段，前端默认处理）
  children?: MenuItem[];   // 子菜单（树形结构）

  // meta 信息（从其他字段映射）
  meta?: {
    title: string;        // 从 name 映射
    icon?: string;        // 从 icon 映射
    hidden?: boolean;     // 从 visible 映射
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

// 菜单转换工具函数
export class MenuUtils {
  /**
   * 将后端原始菜单数据转换为前端MenuItem
   */
  static transformRawMenu(raw: RawMenuNode): MenuItem {
    const menu: MenuItem = {
      // BaseEntity 字段
      id: raw.id,
      createTime: raw.createTime,
      updateTime: raw.updateTime,
      creator: raw.creator,
      updater: raw.updater,
      deleted: raw.deleted,

      // SysMenu 字段
      parentId: raw.parentId,
      name: raw.name,
      url: raw.url,
      perms: raw.perms,
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

  /**
   * 批量转换菜单数据
   */
  static transformRawMenus(rawMenus: RawMenuNode[]): MenuItem[] {
    return rawMenus.map(raw => this.transformRawMenu(raw));
  }

  /**
   * 将前端MenuItem转换为后端数据（用于保存/更新）
   */
  static menuItemToRaw(menu: MenuItem): Partial<RawMenuNode> {
    return {
      id: menu.id,
      parentId: menu.parentId,
      name: menu.name,
      url: menu.url,
      perms: menu.perms,
      type: menu.type,
      openStyle: menu.openStyle,
      weight: menu.weight,
      extra: {
        title: menu.meta?.title,
        icon: menu.icon,
        hidden: menu.meta?.hidden,
        cache: menu.meta?.cache,
        permission: menu.meta?.permission,
        target: menu.meta?.target,
        affix: menu.meta?.affix,
        visible: menu.visible,
        component: menu.component,
      },
    };
  }

  /**
   * 获取菜单类型标签
   */
  static getMenuTypeLabel(type: MenuType): string {
    switch (type) {
      case MenuType.MENU:
        return '菜单';
      case MenuType.BUTTON:
        return '按钮';
      case MenuType.INTERFACE:
        return '接口';
      default:
        return '未知';
    }
  }

  /**
   * 获取打开方式标签
   */
  static getOpenStyleLabel(openStyle: OpenStyle): string {
    switch (openStyle) {
      case OpenStyle.INTERNAL:
        return '内部';
      case OpenStyle.EXTERNAL:
        return '外部';
      default:
        return '内部';
    }
  }

  /**
   * 检查菜单是否为页面菜单（可导航）
   */
  static isNavigableMenu(menu: MenuItem): boolean {
    return menu.type === MenuType.MENU && Boolean(menu.url);
  }

  /**
   * 检查菜单是否有权限标识
   */
  static hasPermission(menu: MenuItem): boolean {
    return Boolean(menu.perms) || (menu.meta?.permission && menu.meta.permission.length > 0);
  }

  /**
   * 获取菜单的所有权限标识
   */
  static getMenuPermissions(menu: MenuItem): string[] {
    const perms = menu.perms ? menu.perms.split(',').filter(p => p.trim()) : [];
    const metaPerms = menu.meta?.permission || [];
    return [...new Set([...perms, ...metaPerms])];
  }
}