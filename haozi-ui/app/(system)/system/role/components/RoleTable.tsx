'use client';

import React from 'react';
import { Button, Empty, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, EyeOutlined, TeamOutlined, PlusOutlined } from '@ant-design/icons';
import type { Role } from '@/types/role';
import ManagementTable from '@/components/ManagementTable';

interface RoleTableProps {
  dataSource: Role[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  searchKeyword: string;
  onEdit: (record: Role) => void;
  onView: (record: Role) => void;
  onDelete: (record: Role) => void;
  onSearch: (keyword: string) => void;
  onPaginationChange: (current: number, pageSize: number) => void;
  onRefresh: () => void;
  onCreate?: () => void;
}

export function RoleTable({
  dataSource,
  loading,
  pagination,
  searchKeyword,
  onEdit,
  onView,
  onDelete,
  onSearch,
  onPaginationChange,
  onRefresh,
  onCreate,
}: RoleTableProps) {
  const columns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string) => (
        <Space>
          <TeamOutlined className="text-blue-500" />
          <span className="font-medium">{name}</span>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="编辑角色">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除角色">
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const extraActions = onCreate && (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={onCreate}
    >
      新增角色
    </Button>
  );

  const emptyContent = (
    <Empty
      description={searchKeyword ? '未找到匹配的角色数据' : '暂无角色数据'}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    >
      {onCreate && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          立即创建角色
        </Button>
      )}
    </Empty>
  );

  return (
    <ManagementTable<Role>
      dataSource={dataSource}
      loading={loading}
      pagination={pagination}
      searchKeyword={searchKeyword}
      statusFilter={undefined}
      showStatusFilter={false}
      columns={columns}
      rowKey="id"
      onSearch={onSearch}
      onStatusFilter={() => {}}
      onPaginationChange={onPaginationChange}
      onRefresh={onRefresh}
      extraActions={extraActions}
      emptyContent={emptyContent}
      searchPlaceholder="请输入角色名称搜索"
      tableSize="middle"
    />
  );
}

export default RoleTable;
