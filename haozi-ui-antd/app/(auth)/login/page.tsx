'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Form,
  Input,
  Button,
  Card,
  Checkbox,
  Space,
  Divider,
  Typography,
  Alert,
  message,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  WechatOutlined,
  QqOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import type { LoginParams } from '@/lib/auth';

const { Title, Text, Link } = Typography;

type AccountLoginValues = LoginParams;
interface MobileLoginValues {
  phone: string;
  password: string;
  rememberMe?: boolean;
}

function LoginPageContent() {
  const [accountForm] = Form.useForm<AccountLoginValues>();
  const [mobileForm] = Form.useForm<MobileLoginValues>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = useMemo(() => searchParams.get('redirect') ?? '/dashboard', [searchParams]);
  const { login, loading, checkAuth, isLoggedIn } = useAuthStore();

  const [loginType, setLoginType] = useState<'account' | 'mobile'>('account');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isLoggedIn || checkAuth()) {
      router.replace(redirect);
    }
  }, [checkAuth, isLoggedIn, redirect, router]);

  const performLogin = async (payload: LoginParams) => {
    setErrorMessage('');
    try {
      const success = await login({
        ...payload,
        rememberMe: payload.rememberMe ?? false,
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

  const handleMobileFinish = async (values: MobileLoginValues) => {
    await performLogin({
      username: values.phone,
      password: values.password,
      rememberMe: values.rememberMe,
    });
  };

  const renderAccountLogin = () => (
    <Form<AccountLoginValues>
      form={accountForm}
      name="account-login"
      initialValues={{ rememberMe: true }}
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

      <Form.Item name="rememberMe" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading} className="h-12 text-lg">
          登录
        </Button>
      </Form.Item>
    </Form>
  );

  const renderMobileLogin = () => (
    <Form<MobileLoginValues>
      form={mobileForm}
      name="mobile-login"
      initialValues={{ rememberMe: true }}
      onFinish={handleMobileFinish}
      size="large"
      layout="vertical"
    >
      <Form.Item
        label="手机号"
        name="phone"
        rules={[
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
        ]}
      >
        <Input prefix={<MobileOutlined />} placeholder="手机号" autoComplete="tel" />
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

      <Form.Item name="rememberMe" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
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

        <div className="flex justify-center mb-6">
          <Space size="large">
            <Button
              type={loginType === 'account' ? 'primary' : 'text'}
              icon={<UserOutlined />}
              onClick={() => setLoginType('account')}
            >
              账号登录
            </Button>
            <Button
              type={loginType === 'mobile' ? 'primary' : 'text'}
              icon={<MobileOutlined />}
              onClick={() => setLoginType('mobile')}
            >
              手机号登录
            </Button>
          </Space>
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

        {loginType === 'account' ? renderAccountLogin() : renderMobileLogin()}

        <div className="mt-6">
          <Divider>其他登录方式</Divider>
          <div className="flex justify-center space-x-6 mt-4">
            <Button type="text" icon={<WechatOutlined />} className="text-green-600 hover:text-green-700">
              微信登录
            </Button>
            <Button type="text" icon={<QqOutlined />} className="text-blue-600 hover:text-blue-700">
              QQ 登录
            </Button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Text type="secondary">
            还没有账号？
            <Link href="/register" className="ml-1 text-blue-600 hover:text-blue-700">
              立即注册
            </Link>
          </Text>
        </div>
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
