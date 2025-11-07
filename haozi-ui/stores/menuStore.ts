import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { request } from '@/lib/api';
import type { MenuItem } from '@/types/menu';
import { MenuType, OpenStyle } from '@/types/menu';

export type RawMenuNode = {
  id?: number | string;
  parentId?: number | string;
  name?: string;
  weight?: number;
  children?: RawMenuNode[];
  extra?: Record<string, unknown>;
};

interface MenuState {
  menus: MenuItem[];
  openKeys: string[];
  selectedKeys: string[];
  collapsed: boolean;

  fetchMenus: () => Promise<MenuItem[]>;
  setMenus: (menus: MenuItem[] | RawMenuNode[]) => void;
  setOpenKeys: (keys: string[]) => void;
  setSelectedKeys: (keys: string[]) => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  generateMenus: () => MenuItem[];
  getFlattenMenus: () => MenuItem[];
  getMenuByPath: (path: string) => MenuItem | null;
  findMenuByKey: (key: string, menus?: MenuItem[]) => MenuItem | null;
}

const TYPE_MAP: Record<number, MenuType> = {
  0: MenuType.MENU,
  1: MenuType.BUTTON,
  2: MenuType.INTERFACE,
};

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      menus: [],
      openKeys: [],
      selectedKeys: [],
      collapsed: false,

      fetchMenus: async () => {
        try {
          const response = await request.get<RawMenuNode[]>('/sys/menu/nav');
          const rawMenus = Array.isArray(response.data?.data) ? response.data.data : [];
          const normalizedMenus = normalizeMenuTree(rawMenus);
          set({ menus: normalizedMenus });
          return normalizedMenus;
        } catch (error) {
          console.error('Failed to load menu tree:', error);
          set({ menus: [] });
          throw error;
        }
      },

      setMenus: (menus) => {
        const normalizedMenus = normalizeMenuTree(menus as RawMenuNode[]);
        set({ menus: normalizedMenus });
      },

      setOpenKeys: (keys) => set({ openKeys: keys }),
      setSelectedKeys: (keys) => set({ selectedKeys: keys }),
      setCollapsed: (collapsed) => set({ collapsed }),
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),

      generateMenus: () => {
        const { menus } = get();
        return filterButtonMenus(menus);
      },

      getFlattenMenus: () => {
        const tree = get().generateMenus();
        return flattenMenuTree(tree);
      },

      getMenuByPath: (path) => {
        const flattenMenus = get().getFlattenMenus();
        // 同时检查 path 和 url 字段，确保路径匹配正确
        return flattenMenus.find((menu) => (menu.path === path || menu.url === path)) ?? null;
      },

      findMenuByKey: (key, menus) => {
        const menuTree = menus ?? get().generateMenus();

        for (const menu of menuTree) {
          if (menu.id.toString() === key) {
            return menu;
          }

          if (menu.children?.length) {
            const found = get().findMenuByKey(key, menu.children);
            if (found) {
              return found;
            }
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
    },
  ),
);

function normalizeMenuTree(nodes: RawMenuNode[] | MenuItem[], parentId = 0): MenuItem[] {
  if (!Array.isArray(nodes)) {
    return [];
  }

  const result: MenuItem[] = [];

  nodes.forEach((node, index) => {
    if (isMenuItem(node)) {
      const cloned: MenuItem = {
        ...node,
        parentId: node.parentId ?? parentId,
        children: node.children ? normalizeMenuTree(node.children, Number(node.id)) : undefined,
      };
      result.push(cloned);
      return;
    }

    const rawNode = node as RawMenuNode;
    const extra = typeof rawNode.extra === 'object' && rawNode.extra ? rawNode.extra : {};

    // 处理后端返回的Tree结构数据
    const id = typeof rawNode.id === 'number' ? rawNode.id : Number(rawNode.id ?? 0);
    const resolvedParentId =
      typeof rawNode.parentId === 'number'
        ? rawNode.parentId
        : typeof rawNode.parentId === 'string'
        ? Number(rawNode.parentId)
        : Number(rawNode.parentId ?? parentId);

    // 权重优先级：节点权重 > extra权重 > 索引
    const weight =
      typeof rawNode.weight === 'number'
        ? rawNode.weight
        : typeof extra.weight === 'number'
        ? (extra.weight as number)
        : index;

    const menuType = resolveMenuType(extra.type);
    const permissions = resolvePermissions(extra.perms);

    // 处理菜单可见性：后端没有visible字段，默认都可见
    const isHidden = extra.hidden === true;
    const isVisible = typeof extra.visible === 'boolean' ? (extra.visible as boolean) : !isHidden;

    // 递归处理子节点
    const children = normalizeMenuTree(rawNode.children ?? [], id);

    const menu: MenuItem = {
      id: String(id),
      parentId: String(resolvedParentId),
      name: typeof rawNode.name === 'string' ? rawNode.name : String(extra.name ?? ''),
      path: typeof extra.url === 'string' ? extra.url : '',
      component: typeof extra.component === 'string' ? extra.component : undefined,
      icon: typeof extra.icon === 'string' ? extra.icon : undefined,
      type: menuType,
      openStyle: OpenStyle.INTERNAL,
      weight: weight,
      visible: isVisible,
      children: children.length > 0 ? children : undefined,
      meta: {
        title: typeof extra.title === 'string' ? extra.title : typeof rawNode.name === 'string' ? rawNode.name : '',
        icon: typeof extra.icon === 'string' ? extra.icon : undefined,
        hidden: !isVisible,
        cache: extra.cache === true,
        permission: permissions,
        target:
          extra.target === '_blank' || extra.target === '_self' ? (extra.target as '_blank' | '_self') : undefined,
        affix: extra.affix === true,
      },
    };

    result.push(menu);
  });

  return result;
}

function filterButtonMenus(menus: MenuItem[]): MenuItem[] {
  return menus
    .filter((menu) => menu.type !== MenuType.BUTTON && menu.visible !== false)
    .map((menu) => ({
      ...menu,
      children: menu.children ? filterButtonMenus(menu.children) : undefined,
    }));
}

function flattenMenuTree(menus: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = [];

  const traverse = (items: MenuItem[]) => {
    for (const item of items) {
      result.push(item);
      if (item.children?.length) {
        traverse(item.children);
      }
    }
  };

  traverse(menus);
  return result;
}

function resolveMenuType(type: unknown): MenuType {
  if (typeof type === 'number') {
    return TYPE_MAP[type] ?? 'menu';
  }

  if (typeof type === 'string') {
    const trimmed = type.trim();
    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric)) {
      return TYPE_MAP[numeric] ?? 'menu';
    }
    switch (trimmed) {
      case 'menu': return MenuType.MENU;
      case 'button': return MenuType.BUTTON;
      case 'directory': return MenuType.INTERFACE;
    }
  }

  return MenuType.MENU;
}

function resolvePermissions(input: unknown): string[] | undefined {
  if (!input) {
    return undefined;
  }

  if (Array.isArray(input)) {
    return input
      .map((item) => item && item.toString().trim())
      .filter((item): item is string => Boolean(item));
  }

  if (typeof input === 'string') {
    return input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return undefined;
}

function isMenuItem(node: unknown): node is MenuItem {
  return Boolean(
    node &&
      typeof node === 'object' &&
      'id' in node &&
      'name' in node &&
      'type' in node &&
      'visible' in node,
  );
}

