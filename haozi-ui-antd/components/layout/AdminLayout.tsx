'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import type { MenuItem } from '@/stores/menuStore';
import type { MenuProps } from 'antd';
import MenuTree from '@/components/ui/MenuTree';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

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

  const menuTree = generateMenus();
  const userDisplayName = userInfo?.nickname || userInfo?.username || '';

  useEffect(() => {
    if (!checkAuth()) {
      router.replace('/login');
    }
  }, [checkAuth, router]);

  useEffect(() => {
    if (isLoggedIn && menus.length === 0) {
      fetchMenus().catch(() => undefined);
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

    const stack: MenuItem[] = [];
    const traverse = (items: MenuItem[]): { selectedKey: string; openKeyList: string[] } | null => {
      for (const item of items) {
        if (item.path === pathname) {
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
    const nextOpenKeys = menuMatch.openKeyList;
    // 同步路由对应的展开项
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenKeys(prev => {
      if (
        prev.length === nextOpenKeys.length &&
        prev.every((key, index) => key === nextOpenKeys[index])
      ) {
        return prev;
      }
      return nextOpenKeys;
    });
  }, [menuMatch.openKeyList]);

  const handleMenuSelect: MenuProps['onSelect'] = ({ key }) => {
    const flattenMenus = getFlattenMenus();
    const target = flattenMenus.find(item => item.id.toString() === String(key));
    if (target?.path && target.path !== pathname) {
      router.push(target.path);
    }
  };

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
          onOpenChange={setOpenKeys}
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
              {userDisplayName && !isMobile && (
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
                  {userDisplayName || '用户菜单'}
                </Button>
              </Dropdown>
            </Space>
          </div>
        </Header>

        <Content className="admin-content">
          <div className="page-container">{children}</div>
        </Content>
      </Layout>

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
