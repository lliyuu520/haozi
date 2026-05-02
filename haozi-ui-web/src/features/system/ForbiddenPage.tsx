import { Button, Result } from 'antd';
import { useNavigate } from '@tanstack/react-router';

/**
 * 无页面访问权限提示页。
 */
export function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="没有访问权限"
      subTitle="当前账号未被授权访问该页面。"
      extra={
        <Button type="primary" onClick={() => navigate({ to: '/dashboard' as never })}>
          返回仪表盘
        </Button>
      }
    />
  );
}
