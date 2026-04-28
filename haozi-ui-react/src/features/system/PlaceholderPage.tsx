import { Card, Typography } from 'antd';
import { useRouterState } from '@tanstack/react-router';
import { routeManifest } from '@/app/route-manifest/routes';
import { PageContainer } from '@/components/PageContainer/PageContainer';
import { useNavigationMenus } from '@/app/navigation/useNavigationMenus';
import { findNavigationRouteByPath } from '@/app/navigation/navigation';

export default function PlaceholderPage() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const { data: navigationRoutes = [] } = useNavigationMenus();
  const route =
    findNavigationRouteByPath(navigationRoutes, pathname) ?? routeManifest.find(item => item.path === pathname);

  return (
    <PageContainer title={route?.title || '功能页面'}>
      <Card className="table-card">
        <Typography.Paragraph>
          该页面的路由、布局和权限入口已接入 React 新底座，具体业务表格和表单将在后续页面迁移任务中实现。
        </Typography.Paragraph>
      </Card>
    </PageContainer>
  );
}
