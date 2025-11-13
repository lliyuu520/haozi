'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Space, Breadcrumb } from 'antd';
import Link from 'next/link';
import UserForm from '../../../components/UserForm';
import { useResolvedRouteId } from '@/hooks/useResolvedRouteId';

export default function ViewUserPage() {
  const router = useRouter();
  const userId = useResolvedRouteId('id');

  const handleEdit = () => {
    if (!userId) return;
    router.push(`/system/user/${userId}/edit`);
  };

  const handleBack = () => {
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
          { title: '查看用户' },
        ]}
      />

      <Card
        title="用户详情"
        extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              编辑用户
            </Button>
            <Button onClick={handleBack}>返回</Button>
          </Space>
        }
      >
        <UserForm
          mode="view"
          userId={userId}
          onSuccess={handleBack}
          onCancel={handleBack}
        />
      </Card>
    </div>
  );
}