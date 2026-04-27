import { Button, Card, Form, Input, Typography, App as AntdApp } from 'antd';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { api } from '@/utils/request';
import { useAuthStore } from '@/store/authStore';
import type { CurrentUser } from '@/types/auth';

type LoginForm = {
  username: string;
  password: string;
};

/**
 * 登录页。
 *
 * 登录成功后后端通过 Sa-Token 建立会话，前端只保存当前用户上下文，不保存 token。
 */
export function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };
  const setCurrentUser = useAuthStore(state => state.setCurrentUser);
  const { message } = AntdApp.useApp();

  const handleFinish = async (values: LoginForm) => {
    const user = await api.post<CurrentUser, LoginForm>('/auth/login', values);
    setCurrentUser(user);
    message.success('登录成功');
    navigate({ to: (search.redirect || '/dashboard') as never, replace: true });
  };

  return (
    <main className="login-page">
      <section className="login-page__panel">
        <div className="login-page__copy">
          <Typography.Title>Haozi Admin</Typography.Title>
          <Typography.Paragraph>
            面向脚手架二代化的 React 管理后台，保留 Sa-Token 的直接与轻量，同时重建契约驱动的前端体验。
          </Typography.Paragraph>
        </div>
        <Card className="login-page__card">
          <Typography.Title level={3}>账号登录</Typography.Title>
          <Form<LoginForm> layout="vertical" onFinish={handleFinish} initialValues={{ username: 'admin' }}>
            <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input size="large" autoComplete="username" />
            </Form.Item>
            <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password size="large" autoComplete="current-password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form>
        </Card>
      </section>
    </main>
  );
}
