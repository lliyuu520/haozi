'use client';

import React, { useState } from 'react';
import { Button, Empty, Modal, Space, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    UserOutlined,
    UnlockOutlined,
    PlusOutlined, ReloadOutlined,
} from '@ant-design/icons';
import type { User } from '@/types/user';
import ManagementTable from '@/components/ManagementTable';

interface UserTableProps {
  dataSource: User[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  searchKeyword: string;
  statusFilter: boolean | undefined;
  onEdit: (record: User) => void;
  onView: (record: User) => void;
  onDelete: (record: User) => void;
  onResetPassword: (record: User) => void;
  onSearch: (keyword: string) => void;
  onStatusFilter: (status: boolean | undefined) => void;
  onPaginationChange: (current: number, pageSize: number) => void;
  onRefresh: () => void;
  onCreate?: () => void;
}

export function UserTable({
  dataSource,
  loading,
  pagination,
  searchKeyword,
  statusFilter,
  onEdit,
  onView,
  onDelete,
  onResetPassword,
  onSearch,
  onStatusFilter,
  onPaginationChange,
  onRefresh,
  onCreate,
}: UserTableProps) {
  const [pendingResetUser, setPendingResetUser] = useState<User | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // 获取状态标签
  const getStatusTag = (enabled: boolean) => {
    return enabled ? (
      <Tag color="success">启用</Tag>
    ) : (
      <Tag color="error">禁用</Tag>
    );
  };

  const columns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150,
      render: (username: string) => (
        <Space>
          <UserOutlined className="text-blue-500" />
          <span className="font-medium">{username}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      align: 'center',
      render: (enabled: boolean) => getStatusTag(enabled),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (time) => (time ? time.split(' ')[0] : '-'),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              className="text-blue-600 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="编辑用户">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className="text-green-600 hover:text-green-700"
            />
          </Tooltip>
          <Tooltip title="重置密码">
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => setPendingResetUser(record)}
              className="text-orange-600 hover:text-orange-700"
            />
          </Tooltip>
          <Tooltip title="删除用户">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              className="text-red-600 hover:text-red-700"
              danger
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
      新增用户
    </Button>
  );

  const emptyContent = (
    <Empty
      description={
        searchKeyword || typeof statusFilter !== 'undefined'
          ? '未找到匹配的用户数据'
          : '暂无用户数据'
      }
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    >
      {onCreate && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          立即创建用户
        </Button>
      )}
    </Empty>
  );

  const handleResetConfirm = async () => {
    if (!pendingResetUser) return;
    try {
      setResetLoading(true);
      await onResetPassword(pendingResetUser);
    } finally {
      setResetLoading(false);
      setPendingResetUser(null);
    }
  };

  const handleResetCancel = () => {
    if (!resetLoading) {
      setPendingResetUser(null);
    }
  };

  return (
    <>
      <ManagementTable<User>
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        searchKeyword={searchKeyword}
        statusFilter={statusFilter}
        showStatusFilter={true}
        columns={columns}
        rowKey="id"
        onSearch={onSearch}
        onStatusFilter={onStatusFilter}
        onPaginationChange={onPaginationChange}
        onRefresh={onRefresh}
        extraActions={extraActions}
        emptyContent={emptyContent}
        searchPlaceholder="请输入用户名或手机号"
        statusFilterPlaceholder="状态筛选"
        tableSize="middle"
      />

      <Modal
        open={Boolean(pendingResetUser)}
        title="重置密码"
        okText="确认重置"
        cancelText="取消"
        confirmLoading={resetLoading}
        onOk={handleResetConfirm}
        onCancel={handleResetCancel}
      >
        {pendingResetUser ? (
          <p>确认要重置用户 "{pendingResetUser.username}" 的密码吗？重置后密码将改为：123456</p>
        ) : null}
      </Modal>
    </>
  );
}
