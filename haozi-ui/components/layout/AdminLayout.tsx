'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Layout, Space, Typography, Button, Dropdown } from 'antd';
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
import type { MenuItem } from '@/types/menu';
import type { MenuProps } from 'antd';
import MenuTree from '@/components/ui/MenuTree';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;


const normalizeRoutePath = (rawPath?: string | null): string | null => {
  if (!rawPath?.trim()) {
    return null;
  }

  const trimmed = rawPath.trim();
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

const resolveMenuRoutePath = (menu?: MenuItem | null): string | null => {
  if (!menu) return null;

  const menuWithUrl = menu as MenuItem & { url?: string };
  const routePath = menu.path || menuWithUrl.url;

  return normalizeRoutePath(routePath);
};

const areStringArraysEqual = (a: string[], b: string[]): boolean => {
  return a.length === b.length && a.every((item, index) => item === b[index]);
};
// 注意：全局模态框配置已移除，改为在各自的页面中实现

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
  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const menuTree = useMemo(() => generateMenus(), [menus, generateMenus]);
  const userDisplayName = userInfo?.nickname || userInfo?.username || '';

  useEffect(() => {
    if (!checkAuth()) {
      router.replace('/login');
    }
  }, [checkAuth, router]);

  useEffect(() => {
    if (isLoggedIn && menus.length === 0) {
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
      return { selectedKey: null as string | null, openKeyList: [] as string[] };
    }

    const findMenuMatch = (items: MenuItem[], stack: MenuItem[] = []): { selectedKey: string; openKeyList: string[] } | null => {
      for (const item of items) {
        const routePath = resolveMenuRoutePath(item);

        if (routePath === pathname) {
          return {
            selectedKey: item.id.toString(),
            openKeyList: stack.map(parent => parent.id.toString()),
          };
        }

        if (item.children?.length) {
          const result = findMenuMatch(item.children, [...stack, item]);
          if (result) return result;
        }
      }
      return null;
    };

    return findMenuMatch(menuTree) ?? { selectedKey: null, openKeyList: [] };
  }, [pathname, menuTree]);

  const selectedKeys = menuMatch.selectedKey ? [menuMatch.selectedKey] : [];

  useEffect(() => {
    // 只在用户未手动操作时同步展开项
    if (isUserInteracting) return;

    const nextOpenKeys = menuMatch.openKeyList;
    if (!areStringArraysEqual(openKeys, nextOpenKeys)) {
      setOpenKeys(nextOpenKeys);
    }
  }, [pathname, menuMatch.openKeyList, isUserInteracting, openKeys]);

  const handleMenuSelect: MenuProps['onSelect'] = ({ key }) => {
    const flattenMenus = getFlattenMenus();
    const target = flattenMenus.find(item => item.id.toString() === String(key));
    const routePath = resolveMenuRoutePath(target);

    if (routePath && routePath !== pathname) {
      router.push(routePath);
    }

    setIsUserInteracting(false);
  };

  const handleMenuOpenChange: MenuProps['onOpenChange'] = (keys) => {
    if (areStringArraysEqual(openKeys, keys as string[])) return;

    setOpenKeys(keys as string[]);
    setIsUserInteracting(true);

    // 清除并重置定时器
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    interactionTimerRef.current = setTimeout(() => setIsUserInteracting(false), 3000);
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

  // 添加分隔线（如果需要）
  if (userMenuItems.length > 2) {
    userMenuItems.splice(userMenuItems.length - 1, 0, { type: 'divider' as const });
  }

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    const target = userMenuActions.find(item => item.key === key);
    if (target) {
      target.action();
      setMobileMenuVisible(false);
    }
  };

  const breadcrumbItems = (pathname || '')
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
                  className={`${theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-500'} mr-4`}
                />
              )}
              {showBreadcrumb && breadcrumbItems.length > 1 && (
                <div className="hide-on-mobile">
                  {breadcrumbItems.map((item, index) => (
                    <span key={item.href} className={`mx-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
                    className={theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-500'}
                  >
                    首页
                  </Button>
                )}

                <Button type="text" icon={<BellOutlined />} className={`${theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-500'} relative`}>
                  通知
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Space>
            </div>

            <Space>
              {isMounted && userDisplayName && !isMobile && (
                <Text className={theme === 'dark' ? 'text-gray-300 mr-2' : 'text-gray-600 mr-2'}>{userDisplayName}</Text>
              )}
              <Button
                type="text"
                icon={<UserOutlined />}
                onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
                className={`${theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-500'} md:hidden`}
              >
                菜单
              </Button>
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button type="text" icon={<UserOutlined />} className={theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-500'}>
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

      {/* 注意：全局路由模态框已移除，改为在各自页面中实现 */}

      {isMobile && (
        <div
          className={`mobile-mask ${mobileMenuVisible ? 'visible' : ''}`}
          onClick={() => setMobileMenuVisible(false)}
        >
          <div className="mobile-menu">
            {userMenuActions.map(item => (
              <div
                key={item.key}
                onClick={() => {
                  item.action();
                  setMobileMenuVisible(false);
                }}
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

