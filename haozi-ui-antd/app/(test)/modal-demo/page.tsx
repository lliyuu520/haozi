'use client';

import React from 'react';
import { Card, Button, Space, Typography, Divider } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function ModalDemoPage() {
  const router = useRouter();

  return (
    <div className="page-container p-6">
      <Card>
        <Title level={2}>路由驱动弹层演示</Title>
        <Text type="secondary">
          这个页面演示了路由驱动弹层的功能。点击下面的按钮来测试不同的弹窗类型。
        </Text>

        <Divider />

        <Space direction="vertical" size="large" className="w-full">
          <div>
            <Title level={4}>用户管理弹窗</Title>
            <Space wrap>
              <Button
                type="primary"
                onClick={() => router.push('/system/user/modal/create')}
              >
                新建用户（路由弹窗）
              </Button>
              <Button
                onClick={() => router.push('/system/user/modal/edit/1')}
              >
                编辑用户 ID=1（路由弹窗）
              </Button>
              <Button onClick={() => router.push('/system/user')}>
                返回用户列表
              </Button>
            </Space>
          </div>

          <div>
            <Title level={4}>菜单管理弹窗</Title>
            <Space wrap>
              <Button
                type="primary"
                onClick={() => router.push('/system/menu/modal/create')}
              >
                新建菜单（路由弹窗）
              </Button>
              <Button
                onClick={() => router.push('/system/menu/modal/edit/1')}
              >
                编辑菜单 ID=1（路由弹窗）
              </Button>
              <Button onClick={() => router.push('/system/menu')}>
                返回菜单列表
              </Button>
            </Space>
          </div>

          <div>
            <Title level={4}>功能特点</Title>
            <ul className="list-disc pl-6 space-y-2">
              <li>弹窗状态与浏览器 URL 同步</li>
              <li>支持浏览器前进/后退按钮</li>
              <li>刷新页面时弹窗状态保持</li>
              <li>可通过分享链接直接打开弹窗</li>
              <li>自动锁定背景页面滚动</li>
              <li>SEO 友好的 URL 结构</li>
            </ul>
          </div>

          <div>
            <Title level={4}>路由结构</Title>
            <ul className="list-disc pl-6 space-y-2">
              <li><Text code>/system/user</Text> - 用户列表页面</li>
              <li><Text code>/system/user/modal/create</Text> - 创建用户弹窗</li>
              <li><Text code>/system/user/modal/edit/[id]</Text> - 编辑用户弹窗</li>
              <li><Text code>/system/menu</Text> - 菜单列表页面</li>
              <li><Text code>/system/menu/modal/create</Text> - 创建菜单弹窗</li>
              <li><Text code>/system/menu/modal/edit/[id]</Text> - 编辑菜单弹窗</li>
            </ul>
          </div>

          <div>
            <Title level={4}>测试步骤</Title>
            <ol className="list-decimal pl-6 space-y-2">
              <li>点击"新建用户"按钮，弹窗打开且 URL 变更</li>
              <li>点击浏览器后退按钮，弹窗自动关闭</li>
              <li>刷新页面，弹窗状态保持</li>
              <li>复制 URL 在新标签页打开，弹窗直接显示</li>
            </ol>
          </div>
        </Space>
      </Card>
    </div>
  );
}