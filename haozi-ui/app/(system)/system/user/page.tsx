'use client';

import {useRouter} from 'next/navigation';
import {Card, Space} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {UserTable} from './components/UserTable';
import {useUserManagement} from './hooks';

export default function UserPage() {
  const router = useRouter();
  const {
    dataSource,
    loading,
    searchKeyword,
    statusFilter,
    pagination,
    setSearchKeyword,
    setStatusFilter,
    refresh,
    handleDeleteConfirm,
    handleResetPassword,
    handlePaginationChange,
  } = useUserManagement();

  const handleAddClick = () => {
    router.push('/system/user/create');
  };

  const handleEditClick = (record: any) => {
    router.push(`/system/user/${record.id}/edit`);
  };

  const handleViewClick = (record: any) => {
    router.push(`/system/user/${record.id}/view`);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleStatusFilter = (status: boolean | undefined) => {
    setStatusFilter(status);
  };

  const handleRefresh = () => {
    void refresh();
  };

  return (
    <div className="page-container">
      <Card
        title={
          <Space>
            <UserOutlined className="text-blue-500" />
            <span>用户管理</span>
          </Space>
        }
      >
        <UserTable
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          searchKeyword={searchKeyword}
          statusFilter={statusFilter}
          onEdit={handleEditClick}
          onView={handleViewClick}
          onDelete={handleDeleteConfirm}
          onResetPassword={handleResetPassword}
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          onPaginationChange={handlePaginationChange}
          onRefresh={handleRefresh}
          onCreate={handleAddClick}
        />
      </Card>
    </div>
  );
}
