'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Layout, Space, Typography, Button, Dropdown, message } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { useMenuStore } from '@/stores/menuStore';
import { useIsMounted } from '@/hooks/useIsMounted';
import { RouteHelper } from '@/utils/routeHelper';
import type { MenuItem } from '@/types/menu';
import type { MenuProps } from 'antd';
import MenuTree from '@/components/ui/MenuTree';
import { ReactRouteModal } from '@/components/ui/ReactRouteModal';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const backendToNextPathMap: Record<string, string> = {
  '/sys/menu/index': '/system/menu',
  '/sys/user/index': '/system/user',
  '/sys/role/index': '/system/role',
  '/sys/dict/type': '/system/dict',
  '/sys/dict/index': '/system/dict',
};

const nameToPathMap: Record<string, string> = {
  菜单管理: '/system/menu',
  用户管理: '/system/user',
  角色管理: '/system/role',
  字典管理: '/system/dict',
  部门管理: '/system/dept',
  岗位管理: '/system/post',
  配置管理: '/system/config',
  通知公告: '/system/notice',
  日志管理: '/system/log',
  在线用户: '/monitor/online',
  定时任务: '/monitor/job',
  服务监控: '/monitor/server',
  缓存监控: '/monitor/cache',
  系统信息: '/system/info',
};

const normalizeRoutePath = (rawPath?: string | null): string | null => {
  if (!rawPath) {
    return null;
  }

  const trimmed = rawPath.trim();
  if (!trimmed) {
    return null;
  }

  // 如果是React风格URL，直接处理
  if (RouteHelper.isPageRoute(trimmed)) {
    return RouteHelper.generateRoute(trimmed);
  }

  const prefixed = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return backendToNextPathMap[prefixed] ?? prefixed;
};

const resolveMenuRoutePath = (menu?: MenuItem | null): string | null => {
  if (!menu) {
    return null;
  }

  const menuWithUrl = menu as MenuItem & { url?: string };
  let routePath = menu.path || menuWithUrl.url;

  // 优先使用URL字段，支持React风格
  if (menuWithUrl.url) {
    if (RouteHelper.isPageRoute(menuWithUrl.url)) {
      return RouteHelper.generateRoute(menuWithUrl.url);
    }
  }

  if (!routePath && menu.name) {
    routePath = nameToPathMap[menu.name] || `/system/${menu.name.toLowerCase().replace(/\s+/g, '')}`;
  }

  return normalizeRoutePath(routePath);
};

const areStringArraysEqual = (a: string[], b: string[]): boolean => {
  if (a === b) {
    return true;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) {
      return false;
    }
  }

  return true;
};
// 全局模态框配置
const GLOBAL_MODAL_CONFIGS = [
  {
    basePath: 'system/menu',
    actions: ['create', 'edit', 'view'],
    defaultConfig: { width: 680 }
  },
  {
    basePath: 'system/user',
    actions: ['create', 'edit', 'view'],
    defaultConfig: { width: 800 }
  },
  {
    basePath: 'system/role',
    actions: ['create', 'edit', 'view'],
    defaultConfig: { width: 800 }
  }
] as const;

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { userInfo, logout, checkAuth, isLoggedIn } = useAuthStore();
  const {
    collapsed,
    theme,
    layout,
    fixedHeader,
    fixedSidebar,
    showBreadcrumb,
    toggleCollapsed,
    isMobile,
  } = useAppStore();
  const { menus, fetchMenus, generateMenus, getFlattenMenus } = useMenuStore();

  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const isMounted = useIsMounted();
  const interactionTimerRef = useRef<NodeJS.Timeout>();

  const menuTree = useMemo(() => generateMenus(), [menus, generateMenus]);
  const userDisplayName = userInfo?.nickname || userInfo?.username || '';

  // 添加调试日志
  console.log('🔍 AdminLayout Debug:', {
    pathname,
    menuTreeLength: menuTree.length,
    isLoggedIn,
    userInfo: !!userInfo,
    userDisplayName,
    rawMenus: menus.length,
    firstMenu: menus[0] ? { id: menus[0].id, name: menus[0].name, path: menus[0].path, url: menus[0].url } : null,
    firstMenuTree: menuTree[0] ? { id: menuTree[0].id, name: menuTree[0].name, path: menuTree[0].path, url: menuTree[0].url } : null,
  });

  useEffect(() => {
    if (!checkAuth()) {
      router.replace('/login');
    }
  }, [checkAuth, router]);

  useEffect(() => {
    if (isLoggedIn && menus.length === 0) {
      console.log('📡 Fetching menus...');
      fetchMenus().catch((error) => {
        console.error('❌ Failed to fetch menus:', error);
      });
    }
  }, [isLoggedIn, menus.length, fetchMenus]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768 && !collapsed) {
        toggleCollapsed();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed, toggleCollapsed]);

  const menuMatch = useMemo(() => {
    if (!menuTree.length) {
      console.log('🏠 No menu tree, returning empty match');
      return { selectedKey: null as string | null, openKeyList: [] as string[] };
    }

    console.log('🔍 Searching menu match for pathname:', pathname);

    const stack: MenuItem[] = [];
    const traverse = (items: MenuItem[]): { selectedKey: string; openKeyList: string[] } | null => {
      for (const item of items) {
        // 同时检查 path 和 url 字段，确保路由匹配正确
        const itemWithUrl = item as MenuItem & { url?: string };
        const rawRoutePath = itemWithUrl.path || itemWithUrl.url;
        const routePath = resolveMenuRoutePath(item);
        console.log(
          `🔍 Checking menu item: ${item.name}, rawPath: ${rawRoutePath}, resolvedRoutePath: ${routePath}, current pathname: ${pathname}`,
        );

        if (routePath === pathname) {
          console.log(`✅ Found matching menu: ${item.name} (ID: ${item.id})`);
          return {
            selectedKey: item.id.toString(),
            openKeyList: stack.map(parent => parent.id.toString()),
          };
        }

        if (item.children?.length) {
          stack.push(item);
          const result = traverse(item.children);
          if (result) {
            return result;
          }
          stack.pop();
        }
      }
      return null;
    };

    return traverse(menuTree) ?? { selectedKey: null, openKeyList: [] };
  }, [pathname, menuTree]);

  const selectedKeys = menuMatch.selectedKey ? [menuMatch.selectedKey] : [];

  useEffect(() => {
    // 只在路由变化时自动同步展开项，且用户没有手动操作的情况下
    if (!isUserInteracting) {
      const nextOpenKeys = menuMatch.openKeyList;
      console.log('🔄 Auto-syncing openKeys:', nextOpenKeys);
      setOpenKeys(nextOpenKeys);
    }
  }, [pathname, menuMatch.openKeyList, isUserInteracting]);

  const handleMenuSelect: MenuProps['onSelect'] = ({ key }) => {
    console.log('??? Menu selected:', key);

    const flattenMenus = getFlattenMenus();
    console.log('?? Flatten menus count:', flattenMenus.length);

    const target = flattenMenus.find(item => item.id.toString() === String(key));
    console.log('?? Found target menu:', target?.name, 'ID:', target?.id, 'path:', target?.path, 'url:', target?.url);

    const routePath = resolveMenuRoutePath(target);
    console.log('?? Route path resolved:', routePath, 'Current pathname:', pathname);

    if (routePath && routePath !== pathname) {
      console.log('?? Navigating to:', routePath);
      router.push(routePath);
    } else {
      console.log('?? No navigation - routePath is empty or same as current');
    }

    // 用户选择菜单后重置用户交互状态
    setIsUserInteracting(false);
  };

const handleMenuOpenChange: MenuProps['onOpenChange'] = (keys) => {
    console.log('📂 Menu open changed:', keys);
    setOpenKeys(keys);
    // 标记用户正在手动操作菜单
    setIsUserInteracting(true);

    // 清除之前的定时器
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }

    // 3秒后重置用户交互状态，允许路由变化时自动同步展开项
    interactionTimerRef.current = setTimeout(() => {
      console.log('⏰ Resetting user interaction state');
      setIsUserInteracting(false);
    }, 3000);
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current);
      }
    };
  }, []);

  const userMenuActions = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      action: () => router.push('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      action: () => router.push('/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      action: () => {
        logout();
        router.push('/login');
      },
    },
  ];

  const userMenuItems: MenuProps['items'] = userMenuActions.map(item => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  if (userMenuItems.length > 2) {
    userMenuItems.splice(userMenuItems.length - 1, 0, { type: 'divider' as const });
  }

  const executeUserMenuAction = (key: string) => {
    const target = userMenuActions.find(item => item.key === key);
    if (target) {
      target.action();
      setMobileMenuVisible(false);
    }
  };

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    executeUserMenuAction(String(key));
  };

  const breadcrumbItems = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, segments) => ({
      title: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: `/${segments.slice(0, index + 1).join('/')}`,
    }));

  return (
    <Layout className={`admin-layout ${theme === 'dark' ? 'admin-layout-dark' : ''}`} data-theme={theme}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`admin-sider ${fixedSidebar ? 'fixed' : ''}`}
        width={240}
        theme={theme}
      >
        <div className="logo-container">
          <div className={`logo ${collapsed ? 'collapsed' : ''}`}>
            {collapsed ? 'H' : 'Haozi Admin'}
          </div>
        </div>

        <MenuTree
          menuItems={menuTree}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onSelect={handleMenuSelect}
          onOpenChange={handleMenuOpenChange}
          inlineCollapsed={collapsed}
        />
      </Sider>

      <Layout>
        <Header className={`admin-header ${fixedHeader ? 'fixed' : ''}`}>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              {layout === 'side' && (
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={toggleCollapsed}
                  className="text-white mr-4"
                />
              )}
              {showBreadcrumb && breadcrumbItems.length > 1 && (
                <div className="hide-on-mobile">
                  {breadcrumbItems.map((item, index) => (
                    <span key={item.href} className="mx-2">
                      {index === breadcrumbItems.length - 1 ? item.title : `${item.title} /`}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Space>
                {layout !== 'top' && (
                  <Button
                    type="text"
                    icon={<HomeOutlined />}
                    onClick={() => router.push('/dashboard')}
                    className="text-white"
                  >
                    首页
                  </Button>
                )}

                <Button type="text" icon={<BellOutlined />} className="text-white relative">
                  通知
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Space>
            </div>

            <Space>
              {isMounted && userDisplayName && !isMobile && (
                <Text className="text-white mr-2">{userDisplayName}</Text>
              )}
              <Button
                type="text"
                icon={<UserOutlined />}
                onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
                className="text-white md:hidden"
              >
                菜单
              </Button>
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button type="text" icon={<UserOutlined />} className="text-white">
                  {isMounted ? (userDisplayName || '用户菜单') : '用户菜单'}
                </Button>
              </Dropdown>
            </Space>
          </div>
        </Header>

        <Content className="admin-content">
          <div className="page-container">{children}</div>
        </Content>
      </Layout>

      {/* 全局路由模态框支持 */}
      {GLOBAL_MODAL_CONFIGS.map((config, index) => (
        <ReactRouteModal
          key={config.basePath}
          basePath={config.basePath}
          actions={config.actions}
          defaultConfig={{
            width: config.defaultConfig.width,
            closable: true,
            maskClosable: false,
            destroyOnClose: true
          }}
        >
          {/* 这里使用渲染模式，具体内容由对应的模态框页面处理 */}
          {(params, close) => {
            // 这里不需要渲染内容，因为具体的模态框页面会处理
            // 这只是为了让路由匹配时能够显示模态框
            return null;
          }}
        </ReactRouteModal>
      ))}

      {isMobile && (
        <div
          className={`mobile-mask ${mobileMenuVisible ? 'visible' : ''}`}
          onClick={() => setMobileMenuVisible(false)}
        >
          <div className="mobile-menu">
            {userMenuActions.map(item => (
              <div
                key={item.key}
                onClick={() => executeUserMenuAction(item.key)}
                className="mobile-menu-item"
                role="button"
                tabIndex={0}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
