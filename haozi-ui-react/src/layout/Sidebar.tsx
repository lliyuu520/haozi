import {
  ApartmentOutlined,
  BookOutlined,
  ControlOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  MonitorOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { routeManifest } from '@/app/route-manifest/routes';
import { useAuthStore } from '@/store/authStore';

const { Sider } = Layout;

const iconMap = {
  ApartmentOutlined: <ApartmentOutlined />,
  BookOutlined: <BookOutlined />,
  ControlOutlined: <ControlOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  DatabaseOutlined: <DatabaseOutlined />,
  MonitorOutlined: <MonitorOutlined />,
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  UserOutlined: <UserOutlined />,
};

type SidebarProps = {
  collapsed: boolean;
};

/**
 * 后台侧边菜单。
 *
 * 菜单来源于前端 route manifest，并按后端授权 routeCodes 过滤，避免数据库直接控制前端组件路径。
 */
export function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: state => state.location.pathname });
  const routeCodes = useAuthStore(state => state.routeCodes);
  const user = useAuthStore(state => state.user);

  const menuItems: MenuProps['items'] = routeManifest
    .filter(route => !route.hideInMenu)
    .filter(route => user?.username === 'admin' || routeCodes.includes(route.code))
    .sort((left, right) => left.order - right.order)
    .map(route => ({
      key: route.path,
      icon: route.icon ? iconMap[route.icon as keyof typeof iconMap] : undefined,
      label: route.title,
    }));

  return (
    <Sider width={252} collapsed={collapsed} className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <span className="admin-sidebar__brand-mark">H</span>
        {!collapsed && <span className="admin-sidebar__brand-text">Haozi Admin</span>}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={({ key }) => navigate({ to: key })}
      />
    </Sider>
  );
}
