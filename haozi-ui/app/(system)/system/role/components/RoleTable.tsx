'use client';

import React from 'react';
import { Button, Space, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, EyeOutlined, TeamOutlined } from '@ant-design/icons';
import type { Role } from '@/types/role';

interface RoleTableProps {
  dataSource: Role[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onEdit: (record: Role) => void;
  onView: (record: Role) => void;
  onDelete: (record: Role) => void;
  onPaginationChange?: (current: number, pageSize: number) => void;
}

export function RoleTable({
  dataSource,
  loading = false,
  pagination,
  onEdit,
  onView,
  onDelete,
  onPaginationChange,
}: RoleTableProps) {
  const columns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
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

  return (
    <Table<Role>
      rowKey="id"
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      pagination={
      pagination ? {
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条/共 ${total} 条数据`,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: onPaginationChange,
        onShowSizeChange: onPaginationChange,
      } : false
    }
      scroll={{ x: 1200 }}
      size="middle"
      rowClassName={(record) => {
        return'opacity-60';
      }}
    />
  );
}

export default RoleTable;
