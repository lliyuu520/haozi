'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, Space, Empty, Input, Tooltip } from 'antd';
import {
  PlusOutlined,
  TeamOutlined,
  ReloadOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { RoleTable } from './components/RoleTable';
import { useRoleManagement } from './hooks';

const { Search } = Input;

export default function RolePage() {
  const router = useRouter();
  const {
    dataSource,
    loading,
    searchKeyword,
    pagination,
    setSearchKeyword,
    refresh,
    handleDeleteConfirm,
    handlePaginationChange,
  } = useRoleManagement();

  const handleAddClick = () => {
    router.push('/system/role/create');
  };

  const handleEditClick = (record: any) => {
    router.push(`/system/role/${record.id}/edit`);
  };

  const handleViewClick = (record: any) => {
    router.push(`/system/role/${record.id}/view`);
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleClearFilters = () => {
    setSearchKeyword('');
  };

  const handleRefresh = () => {
    void refresh();
  };

  return (
    <div className="page-container">
      <Card
        title={
          <Space>
            <TeamOutlined className="text-blue-500" />
            <span>角色管理</span>
          </Space>
        }
        extra={
          <Space wrap>
            {/* 搜索框 */}
            <Search
              placeholder="请输入角色名称"
              allowClear
              style={{ width: 200 }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              enterButton
            />

            {/* 刷新按钮 */}
            <Tooltip title="刷新数据">
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                刷新
              </Button>
            </Tooltip>

            {searchKeyword && (
              <Tooltip title="清空筛选条件">
                <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
                  清空
                </Button>
              </Tooltip>
            )}

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
              新建角色
            </Button>
          </Space>
        }
      >
        {/* 状态信息 */}
        {searchKeyword && (
          <div style={{ marginBottom: 16, color: '#666' }}>
            <Space>
              <span>搜索: "{searchKeyword}"</span>
              <span>共找到 {pagination.total} 条结果</span>
            </Space>
          </div>
        )}

        {pagination.total > 0 ? (
          <RoleTable
            dataSource={dataSource}
            loading={loading}
            pagination={pagination}
            onEdit={handleEditClick}
            onView={handleViewClick}
            onDelete={handleDeleteConfirm}
            onPaginationChange={handlePaginationChange}
          />
        ) : (
          <Empty
            description={searchKeyword ? '未找到匹配的角色数据' : '暂无角色数据'}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Space>
              {searchKeyword && (
                <Button onClick={handleClearFilters}>清空筛选条件</Button>
              )}
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
                创建第一个角色
              </Button>
            </Space>
          </Empty>
        )}
      </Card>
    </div>
  );
}
