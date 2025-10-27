'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import {
  UserVO,
  UserQuery,
  deleteUser,
  getUserPage,
} from '@/services/user';
import { useSimpleRouteModal } from '@/hooks/useRouteModalV2';

const { Text } = Typography;

const STATUS_TAG: Record<number, { label: string; color: 'success' | 'error' | 'warning' }> = {
  0: { label: '启用', color: 'success' },
  1: { label: '禁用', color: 'error' },
  2: { label: '锁定', color: 'warning' },
};


export default function UserManagementPage() {
  const router = useRouter();
  const routeModal = useSimpleRouteModal('system/user', '用户');
  const [filterForm] = Form.useForm<UserQuery>();
  const [dataSource, setDataSource] = useState<UserVO[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<UserQuery>({});
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  
  const loadData = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await getUserPage({
        ...searchParams,
        page: current,
        limit: pageSize,
      });
      const pageData = response.data?.data;
      setDataSource(pageData?.list ?? []);
      setTotal(pageData?.total ?? 0);
    } catch (error) {
      console.error(error);
      message.error('加载用户数据失败，请稍后重试');
    } finally {
      setTableLoading(false);
    }
  }, [current, pageSize, searchParams]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination.pageSize && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
  };

  const handleSearch = (values: UserQuery) => {
    setSearchParams(values);
    setCurrent(1);
  };

  const handleResetFilters = () => {
    filterForm.resetFields();
    setSearchParams({});
    setCurrent(1);
  };

  const handleAdd = () => {
    // 使用路由模态框Hook打开创建弹窗
    routeModal.openModal('create');
  };

  const handleEdit = useCallback((record: UserVO) => {
    // 使用路由模态框Hook打开编辑弹窗
    routeModal.openModal('edit', { id: record.id.toString() });
  }, [routeModal]);

  const handleView = useCallback((record: UserVO) => {
    // 使用路由模态框Hook打开查看弹窗
    routeModal.openModal('view', { id: record.id.toString() });
  }, [routeModal]);

  const handleDelete = useCallback((userId: number) => {
    Modal.confirm({
      title: '删除用户',
      content: '确认删除该用户吗？该操作无法恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteUser(userId);
          message.success('删除成功');
          void loadData();
        } catch (error) {
          console.error(error);
          message.error('删除失败，请稍后再试');
        }
      },
    });
  }, [loadData]);

  
  const columns: ColumnsType<UserVO> = useMemo(
    () => [
      {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        width: 80,
        render: (avatar: string | undefined) => <Avatar src={avatar} icon={<UserOutlined />} />,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 140,
        render: (username: string) => <Text strong>{username}</Text>,
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 140,
        render: (nickname?: string) => nickname || '-',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 200,
        render: (email?: string) => email || '-',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        width: 160,
        render: (phone?: string) => phone || '-',
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
        width: 160,
        render: (roleName?: string) => roleName || '-',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (status: number = 0) => {
          const meta = STATUS_TAG[status] ?? STATUS_TAG[0];
          return <Tag color={meta.color}>{meta.label}</Tag>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
        render: (time?: string) => time || '-',
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 160,
        render: (_, record) => (
          <Space size="small">
            <Tooltip title="编辑">
              <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
            </Tooltip>
            <Tooltip title="删除">
              <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleEdit, handleDelete],
  );

  return (
    <div className="page-container">
      <Card
        title="用户管理"
        extra={
          <Space>
            <Button onClick={handleResetFilters}>重置筛选</Button>
            <Button onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建用户
            </Button>
          </Space>
        }
      >
        <Form<UserQuery>
          form={filterForm}
          layout="inline"
          onFinish={handleSearch}
          className="mb-4"
        >
          <Form.Item name="username" label="用户名">
            <Input allowClear placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input allowClear placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select allowClear placeholder="请选择状态" style={{ width: 160 }}>
              <Select.Option value={0}>启用</Select.Option>
              <Select.Option value={1}>禁用</Select.Option>
              <Select.Option value={2}>锁定</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleResetFilters}>清空</Button>
            </Space>
          </Form.Item>
        </Form>

        <Table<UserVO>
          rowKey="id"
          loading={tableLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: tot => `共 ${tot} 条`,
          }}
          scroll={{ x: 960 }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
}
