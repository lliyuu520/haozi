// 菜单项类型
export interface MenuItem {
  id: number;
  parentId: number;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  type: 'menu' | 'button' | 'directory';
  sort: number;
  visible: boolean;
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

// 菜单状态
export interface MenuState {
  menus: MenuItem[];
  openKeys: string[];
  selectedKeys: string[];
  collapsed: boolean;
}

// 面包屑项类型
export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: string;
}