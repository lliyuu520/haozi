import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Layout, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { api } from '@/utils/request';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';

const { Header } = Layout;

/**
 * 顶部导航栏。
 *
 * 负责承载全局动作，不放业务页面按钮，避免主流程入口职责混乱。
 */
export function HeaderBar() {
  const navigate = useNavigate();
  const collapsed = useUiStore(state => state.sidebarCollapsed);
  const setCollapsed = useUiStore(state => state.setSidebarCollapsed);
  const user = useAuthStore(state => state.user);
  const clear = useAuthStore(state => state.clear);

  const userItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      await api.post<void>('/auth/logout').catch(() => undefined);
      clear();
      navigate({ to: '/login', replace: true });
    }
  };

  return (
    <Header className="admin-header">
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <Typography.Text className="admin-header__title">管理控制台</Typography.Text>
      </Space>
      <Space>
        <Button type="text" icon={<ReloadOutlined />} onClick={() => location.reload()}>
          刷新
        </Button>
        <Dropdown menu={{ items: userItems, onClick: handleUserMenuClick }} placement="bottomRight">
          <Button type="text">{user?.realName || user?.username || '用户'}</Button>
        </Dropdown>
      </Space>
    </Header>
  );
}
