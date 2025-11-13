'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Space, Breadcrumb } from 'antd';
import Link from 'next/link';
import UserForm from '../../../components/UserForm';

export default function ViewUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/system/user/${params.id}/edit`);
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
          userId={params.id}
          onSuccess={handleBack}
          onCancel={handleBack}
        />
      </Card>
    </div>
  );
}