import { Button, Result } from 'antd';
import { useNavigate } from '@tanstack/react-router';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="页面不存在"
      subTitle="当前地址没有匹配到可访问页面。"
      extra={
        <Button type="primary" onClick={() => navigate({ to: '/dashboard' as never })}>
          返回仪表盘
        </Button>
      }
    />
  );
}
