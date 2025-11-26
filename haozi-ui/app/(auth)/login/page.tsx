'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Form,
  Input,
  Button,
  Card,
  Divider,
  Typography,
  Alert,
  message,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import type { LoginParams } from '@/lib/auth';

const { Title, Text, Link } = Typography;

type AccountLoginValues = LoginParams;

function LoginPageContent() {
  const [accountForm] = Form.useForm<AccountLoginValues>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = useMemo(() => searchParams?.get('redirect') ?? '/dashboard', [searchParams]);
  const { login, loading, checkAuth } = useAuthStore();

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if ( checkAuth()) {
      router.replace(redirect);
    }
  }, [checkAuth, redirect, router]);

  const performLogin = async (payload: LoginParams) => {
    setErrorMessage('');
    try {
      const success = await login({
        ...payload
      });

      if (success) {
        message.success('登录成功');
        router.replace(redirect);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
        return;
      }
      setErrorMessage('登录失败，请检查用户名或密码');
    }
  };

  const handleAccountFinish = async (values: AccountLoginValues) => {
    await performLogin(values);
  };

  const renderAccountLogin = () => (
    <Form<AccountLoginValues>
      form={accountForm}
      name="account-login"
      onFinish={handleAccountFinish}
      size="large"
      layout="vertical"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, message: '用户名长度不能少于 3 位' },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="用户名" autoComplete="username" />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码长度不能少于 6 位' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="密码"
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading} className="h-12 text-lg">
          登录
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <div className="text-center mb-8">
          <Title level={2} className="mb-2 text-blue-600">
            Haozi Admin
          </Title>
          <Text type="secondary">企业数字化运营平台</Text>
        </div>

        {errorMessage && (
          <Alert
            message="登录失败"
            description={errorMessage}
            type="error"
            showIcon
            closable
            className="mb-4"
            onClose={() => setErrorMessage('')}
          />
        )}

        {renderAccountLogin()}
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <Card className="w-full max-w-md shadow-xl border-0">
            <div className="text-center mb-8">
              <Title level={3} className="mb-2 text-blue-600">
                Haozi Admin
              </Title>
              <Text type="secondary">正在加载登录信息，请稍候…</Text>
            </div>
          </Card>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
