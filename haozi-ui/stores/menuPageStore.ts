import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

// 定义基本类型，避免业务逻辑依赖
export enum MenuType {
  MENU = 0,
  BUTTON = 1,
  INTERFACE = 2,
}

export interface MenuTreeNode {
  id: string;
  parentId: string;
  name: string;
  url?: string;
  perms?: string;
  type: MenuType;
  openStyle: number;
  weight: number;
  icon?: string;
  hidden?: number;
  children?: MenuTreeNode[];
  [key: string]: any;
}

/**
 * 菜单页面状态管理接口
 */
interface MenuPageState {
  // 列表数据状态
  dataSource: MenuTreeNode[];
  loading: boolean;

  // 筛选状态
  menuType: MenuType | undefined;
  searchKeyword: string;

  // 表格状态
  selectedRowKeys: string[];
  expandedRowKeys: string[];

  // 分页状态
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };

  // 最后更新时间（用于数据同步）
  lastUpdateTime: number;

  // 操作方法
  setDataSource: (data: MenuTreeNode[]) => void;
  setLoading: (loading: boolean) => void;
  setMenuType: (type: MenuType | undefined) => void;
  setSearchKeyword: (keyword: string) => void;
  setSelectedRows: (keys: string[]) => void;
  setExpandedRows: (keys: string[]) => void;
  setPagination: (pagination: Partial<MenuPageState['pagination']>) => void;
  updateLastTime: () => void;

  // 重置方法
  resetFilters: () => void;
  resetTableState: () => void;
  resetAll: () => void;
}

/**
 * 菜单页面全局状态管理
 */
export const useMenuPageStore = create<MenuPageState>()(
  persist(
    (set, get) => ({
      // 初始状态
      dataSource: [],
      loading: false,
      menuType: undefined,
      searchKeyword: '',
      selectedRowKeys: [],
      expandedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
      },
      lastUpdateTime: Date.now(),

      // 数据操作方法
      setDataSource: (data) => set({ dataSource: data, lastUpdateTime: Date.now() }),
      setLoading: (loading) => set({ loading }),
      setMenuType: (type) => set({ menuType: type }),
      setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
      setSelectedRows: (keys) => set({ selectedRowKeys: keys }),
      setExpandedRows: (keys) => set({ expandedRowKeys: keys }),
      setPagination: (pagination) => set((state) => ({
        pagination: { ...state.pagination, ...pagination }
      })),
      updateLastTime: () => set({ lastUpdateTime: Date.now() }),

      // 重置方法
      resetFilters: () => set({
        menuType: undefined,
        searchKeyword: '',
        pagination: { current: 1, pageSize: 20, total: 0 },
      }),

      resetTableState: () => set({
        selectedRowKeys: [],
        expandedRowKeys: [],
      }),

      resetAll: () => set({
        dataSource: [],
        loading: false,
        menuType: undefined,
        searchKeyword: '',
        selectedRowKeys: [],
        expandedRowKeys: [],
        pagination: { current: 1, pageSize: 20, total: 0 },
        lastUpdateTime: Date.now(),
      }),
    }),
    {
      name: 'haozi-menu-page-store', // localStorage key
      partialize: (state) => ({
        // 只持久化这些状态，loading 和 dataSource 不需要持久化
        menuType: state.menuType,
        searchKeyword: state.searchKeyword,
        pagination: state.pagination,
        selectedRowKeys: state.selectedRowKeys,
        expandedRowKeys: state.expandedRowKeys,
      }),
    }
  )
);

// 简单的单独 hooks（推荐使用，避免对象比较）
export const useDataSource = () => useMenuPageStore((state) => state.dataSource);
export const useLoading = () => useMenuPageStore((state) => state.loading);
export const useMenuType = () => useMenuPageStore((state) => state.menuType);
export const useSearchKeyword = () => useMenuPageStore((state) => state.searchKeyword);
export const usePagination = () => useMenuPageStore((state) => state.pagination);
export const useSelectedRows = () => useMenuPageStore((state) => state.selectedRowKeys);
export const useExpandedRows = () => useMenuPageStore((state) => state.expandedRowKeys);

// 操作相关的 hooks
export const useSetSelectedRows = () => useMenuPageStore((state) => state.setSelectedRows);
export const useSetExpandedRows = () => useMenuPageStore((state) => state.setExpandedRows);
export const useSetDataSource = () => useMenuPageStore((state) => state.setDataSource);
export const useSetLoading = () => useMenuPageStore((state) => state.setLoading);
export const useSetMenuType = () => useMenuPageStore((state) => state.setMenuType);
export const useSetSearchKeyword = () => useMenuPageStore((state) => state.setSearchKeyword);
export const useSetPagination = () => useMenuPageStore((state) => state.setPagination);