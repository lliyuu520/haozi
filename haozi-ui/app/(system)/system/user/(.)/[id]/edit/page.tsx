'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Space, Breadcrumb } from 'antd';
import Link from 'next/link';
import UserForm from '../../../components/UserForm';
import { useResolvedRouteId } from '@/hooks/useResolvedRouteId';

export default function EditUserPage() {
  const router = useRouter();
  const userId = useResolvedRouteId('id');

  const handleSuccess = () => {
    router.push('/system/user');
  };

  const handleCancel = () => {
    router.push('/system/user');
  };

  return (
    <div className="page-container">
      {/* 面包屑导航 */}
      <Breadcrumb
        className="mb-4"
        items={[
          {
            title: (
              <Link href="/system/user">
                <Space>
                  <ArrowLeftOutlined />
                  用户管理
                </Space>
              </Link>
            ),
          },
          { title: '编辑用户' },
        ]}
      />

      <Card title="编辑用户">
        <UserForm
          mode="edit"
          userId={userId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  );
}