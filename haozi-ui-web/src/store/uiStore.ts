import { create } from 'zustand';

type TabItem = {
  path: string;
  title: string;
};

type UiState = {
  sidebarCollapsed: boolean;
  tabs: TabItem[];
  setSidebarCollapsed: (collapsed: boolean) => void;
  upsertTab: (tab: TabItem) => void;
  closeTab: (path: string) => void;
};

/**
 * 客户端 UI 状态。
 *
 * 服务端数据统一交给 TanStack Query，该 store 只维护侧边栏和标签页等纯前端交互状态。
 */
export const useUiStore = create<UiState>(set => ({
  sidebarCollapsed: false,
  tabs: [],
  setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),
  upsertTab: tab =>
    set(state => ({
      tabs: state.tabs.some(item => item.path === tab.path) ? state.tabs : [...state.tabs, tab],
    })),
  closeTab: path =>
    set(state => ({
      tabs: state.tabs.filter(item => item.path !== path),
    })),
}));
