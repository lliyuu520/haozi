// 全局菜单类型定义 - 供其他模块使用
export enum MenuType {
  MENU = 0,      // 菜单
  BUTTON = 1,   // 按钮
  INTERFACE = 2, // 接口
}

export enum OpenStyle {
  INTERNAL = 0,  // 内部打开
  EXTERNAL = 1,  // 外部打开
}

// 菜单项类型 - 其他模块需要的简化版本
export interface MenuItem {
  id: string;
  parentId: string;
  name: string;
  url: string;
  perms: string;
  type: MenuType;
  openStyle: OpenStyle;
  weight: number;
  icon: string;
  hidden: boolean;
  visible?: boolean;
  children?: MenuItem[];
  meta?: {
    title: string;
    icon?: string;
    hidden?: boolean;
    cache?: boolean;
    permission?: string[];
    target?: '_blank' | '_self';
    affix?: boolean;
  };
}