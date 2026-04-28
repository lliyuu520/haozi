import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getMenuIcon } from '@/app/route-manifest/icons';
import { useNavigationMenus } from '@/app/navigation/useNavigationMenus';
import { findNavigationAncestorKeys, type NavigationRoute } from '@/app/navigation/navigation';

const { Sider } = Layout;

type SidebarProps = {
  collapsed: boolean;
};

/**
 * 后台侧边菜单。
 *
 * 菜单展示树从后端当前用户授权菜单获取，实际可跳转页面仍由前端 route manifest 白名单兜底。
 */
export function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: state => state.location.pathname });
  const { data: navigationRoutes = [] } = useNavigationMenus();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const menuItems = toMenuItems(navigationRoutes);

  useEffect(() => {
    const ancestorKeys = findNavigationAncestorKeys(navigationRoutes, pathname);
    setOpenKeys(current => mergeKeys(current, ancestorKeys));
  }, [navigationRoutes, pathname]);

  return (
    <Sider width={252} collapsed={collapsed} collapsedWidth={64} theme="light" className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <span className="admin-sidebar__brand-mark">H</span>
        {!collapsed && <span className="admin-sidebar__brand-text">Haozi Admin</span>}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        openKeys={collapsed ? [] : openKeys}
        items={menuItems}
        onOpenChange={keys => setOpenKeys(keys.map(String))}
        onClick={({ key }) => {
          if (String(key).startsWith('/')) {
            navigate({ to: key });
          }
        }}
      />
    </Sider>
  );
}

function toMenuItems(routes: NavigationRoute[]): MenuProps['items'] {
  return routes.map(route => ({
    key: route.key,
    icon: getMenuIcon(route.icon),
    label: route.title,
    children: route.children.length > 0 ? toMenuItems(route.children) : undefined,
  }));
}

function mergeKeys(current: string[], incoming: string[]) {
  const next = Array.from(new Set([...current, ...incoming]));
  return next.length === current.length && next.every((key, index) => key === current[index]) ? current : next;
}
