import { create } from 'zustand';

interface AppState {
  // 主题相关
  theme: 'light' | 'dark';
  primaryColor: string;

  // 布局相关
  layout: 'side' | 'top' | 'mix';
  contentWidth: 'Fluid' | 'Fixed';
  fixedHeader: boolean;
  fixedSidebar: boolean;
  showBreadcrumb: boolean;
  showTabs: boolean;

  // 系统相关
  collapsed: boolean;
  loading: boolean;
  isMobile: boolean;

  // 操作
  setTheme: (theme: 'light' | 'dark') => void;
  setPrimaryColor: (color: string) => void;
  setLayout: (layout: 'side' | 'top' | 'mix') => void;
  setContentWidth: (width: 'Fluid' | 'Fixed') => void;
  setFixedHeader: (fixed: boolean) => void;
  setFixedSidebar: (fixed: boolean) => void;
  setShowBreadcrumb: (show: boolean) => void;
  setShowTabs: (show: boolean) => void;
  setLoading: (loading: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

const defaultSettings = {
  theme: 'light' as const,
  primaryColor: '#1677ff',
  layout: 'side' as const,
  contentWidth: 'Fluid' as const,
  fixedHeader: true,
  fixedSidebar: false,
  showBreadcrumb: true,
  showTabs: true,
  collapsed: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  ...defaultSettings,
  loading: false,
  isMobile: false,

  // 设置主题
  setTheme: (theme) => set({ theme }),

  // 设置主色调
  setPrimaryColor: (primaryColor) => set({ primaryColor }),

  // 设置布局模式
  setLayout: (layout) => set({ layout }),

  // 设置内容宽度
  setContentWidth: (contentWidth) => set({ contentWidth }),

  // 设置固定头部
  setFixedHeader: (fixedHeader) => set({ fixedHeader }),

  // 设置固定侧边栏
  setFixedSidebar: (fixedSidebar) => set({ fixedSidebar }),

  // 设置面包屑显示
  setShowBreadcrumb: (showBreadcrumb) => set({ showBreadcrumb }),

  // 设置标签页显示
  setShowTabs: (showTabs) => set({ showTabs }),

  // 设置加载状态
  setLoading: (loading) => set({ loading }),

  // 设置移动端状态
  setIsMobile: (isMobile) => set({ isMobile }),

  // 设置折叠状态
  setCollapsed: (collapsed) => set({ collapsed }),

  // 切换折叠状态
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
}));