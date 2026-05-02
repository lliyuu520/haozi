import { Layout } from 'antd';
import { Outlet } from '@tanstack/react-router';
import { HeaderBar } from '@/layout/HeaderBar';
import { Sidebar } from '@/layout/Sidebar';
import { TabsBar } from '@/layout/TabsBar';
import { useUiStore } from '@/store/uiStore';

const { Content } = Layout;

/**
 * 管理后台主布局。
 *
 * 左侧菜单、顶部动作区、标签页和内容区在这里形成稳定骨架，业务页面只负责自身内容。
 */
export function AdminLayout() {
  const collapsed = useUiStore(state => state.sidebarCollapsed);

  return (
    <Layout className="admin-shell">
      <Sidebar collapsed={collapsed} />
      <Layout className="admin-shell__main">
        <HeaderBar />
        <TabsBar />
        <Content className="admin-shell__content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
