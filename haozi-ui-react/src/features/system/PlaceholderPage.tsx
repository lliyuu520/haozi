import { Card, Typography } from 'antd';
import { useRouterState } from '@tanstack/react-router';
import { routeManifest } from '@/app/route-manifest/routes';

export default function PlaceholderPage() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const route = routeManifest.find(item => item.path === pathname);

  return (
    <Card className="page-stack">
      <Typography.Title level={2}>{route?.title || '功能页面'}</Typography.Title>
      <Typography.Paragraph>
        该页面的路由、布局和权限入口已接入 React 新底座，具体业务表格和表单将在后续页面迁移任务中实现。
      </Typography.Paragraph>
    </Card>
  );
}
