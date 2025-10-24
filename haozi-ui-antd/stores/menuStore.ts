import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { request } from '@/lib/api';

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
  };
}

interface MenuState {
  // 状态
  menus: MenuItem[];
  openKeys: string[];
  selectedKeys: string[];
  collapsed: boolean;

  // 操作
  fetchMenus: () => Promise<void>;
  setOpenKeys: (keys: string[]) => void;
  setSelectedKeys: (keys: string[]) => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  generateMenus: () => MenuItem[];
  getFlattenMenus: () => MenuItem[];
  getMenuByPath: (path: string) => MenuItem | null;
  findMenuByKey: (key: string, menus?: MenuItem[]) => MenuItem | null;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      // 初始状态
      menus: [],
      openKeys: [],
      selectedKeys: [],
      collapsed: false,

      // 获取菜单
      fetchMenus: async () => {
        try {
          const response = await request.get<MenuItem[]>('/sys/menu/user-menu');
          const { data } = response.data;

          if (data) {
            set({ menus: data });
          }
        } catch (error) {
          console.error('获取菜单失败:', error);
        }
      },

      // 设置展开的菜单
      setOpenKeys: (keys) => set({ openKeys: keys }),

      // 设置选中的菜单
      setSelectedKeys: (keys) => set({ selectedKeys: keys }),

      // 设置折叠状态
      setCollapsed: (collapsed) => set({ collapsed }),

      // 切换折叠状态
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),

      // 生成菜单树
      generateMenus: () => {
        const { menus } = get();
        return buildMenuTree(menus.filter(menu => menu.type !== 'button'));
      },

      // 获取扁平化菜单
      getFlattenMenus: () => {
        const { menus } = get();
        return flattenMenus(menus);
      },

      // 根据路径获取菜单
      getMenuByPath: (path) => {
        const flattenMenus = get().getFlattenMenus();
        return flattenMenus.find(menu => menu.path === path) || null;
      },

      // 根据key查找菜单
      findMenuByKey: (key, menus) => {
        const menuList = menus || get().menus;

        for (const menu of menuList) {
          if (menu.id.toString() === key) {
            return menu;
          }

          if (menu.children) {
            const found = get().findMenuByKey(key, menu.children);
            if (found) return found;
          }
        }

        return null;
      },
    }),
    {
      name: 'haozi_menu_store',
      partialize: (state) => ({
        openKeys: state.openKeys,
        collapsed: state.collapsed,
      }),
    }
  )
);

// 构建菜单树
function buildMenuTree(menus: MenuItem[], parentId = 0): MenuItem[] {
  const result: MenuItem[] = [];

  for (const menu of menus) {
    if (menu.parentId === parentId) {
      const children = buildMenuTree(menus, menu.id);
      if (children.length > 0) {
        menu.children = children;
      }
      result.push(menu);
    }
  }

  return result.sort((a, b) => a.sort - b.sort);
}

// 扁平化菜单
function flattenMenus(menus: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = [];

  const flatten = (items: MenuItem[]) => {
    for (const item of items) {
      result.push(item);
      if (item.children) {
        flatten(item.children);
      }
    }
  };

  flatten(menus);
  return result;
}