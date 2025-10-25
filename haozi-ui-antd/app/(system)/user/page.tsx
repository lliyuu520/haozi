'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
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
import {
  UserVO,
  UserQuery,
  UserCreateParams,
  UserUpdateParams,
  deleteUser,
  updateUser,
  createUser,
  getUserPage,
  batchDeleteUsers,
} from '@/services/user';

const { Text } = Typography;

const STATUS_TAG: Record<number, { label: string; color: 'success' | 'error' | 'warning' }> = {
  0: { label: '启用', color: 'success' },
  1: { label: '禁用', color: 'error' },
  2: { label: '锁定', color: 'warning' },
};

export default function UserManagementPage() {
  const [filterForm] = Form.useForm<UserQuery>();
  const [form] = Form.useForm<UserCreateParams>();
  const [dataSource, setDataSource] = useState<UserVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<UserQuery>({});
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserVO | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserPage({
        ...searchParams,
        current,
        size: pageSize,
      });
      const pageData = response.data?.data;
      setDataSource(pageData?.records ?? []);
      setTotal(pageData?.total ?? 0);
      if (pageData?.current) {
        setCurrent(pageData.current);
      }
      if (pageData?.size) {
        setPageSize(pageData.size);
      }
      setSelectedRowKeys([]);
    } catch (error) {
      message.error('加载用户数据失败，请稍后重试');
    } finally {
      setLoading(false);
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
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: UserVO) => {
    setEditingUser(record);
    form.setFieldsValue({
      username: record.username,
      nickname: record.nickname,
      email: record.email,
      phone: record.phone,
      roleId: record.roleId,
      status: record.status ?? 0,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      message.success('删除成功');
      void loadData();
    } catch (error) {
      message.error('删除失败，请稍后再试');
    }
  };

  const selectedIds = useMemo(() => {
    return dataSource
      .filter((item) => selectedRowKeys.includes(item.id))
      .map((item) => item.id);
  }, [dataSource, selectedRowKeys]);

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      message.warning('请选择需要删除的用户');
      return;
    }
    try {
      await batchDeleteUsers(selectedIds as number[]);
      message.success(`成功删除 ${selectedIds.length} 条记录`);
      void loadData();
    } catch (error) {
      message.error('批量删除失败，请稍后再试');
    }
  };

  const handleSubmit = async (values: UserCreateParams) => {
    setLoading(true);
    try {
      if (editingUser) {
        const updateParams: UserUpdateParams = {
          id: editingUser.id,
          nickname: values.nickname,
          email: values.email,
          phone: values.phone,
          roleId: values.roleId,
          status: values.status,
        };
        await updateUser(updateParams);
        message.success('更新成功');
      } else {
        await createUser({
          ...values,
          password: values.password ?? '',
        });
        message.success('创建成功');
      }
      setIsModalVisible(false);
      setEditingUser(null);
      form.resetFields();
      void loadData();
    } catch (error) {
      message.error(editingUser ? '更新失败，请稍后再试' : '创建失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<UserVO> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string | undefined) => (
        <Avatar src={avatar} icon={<UserOutlined />} />
      ),
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
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 160,
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 140,
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
          <Popconfirm
            title="确认删除该用户吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div className="page-container">
      <Card
        title="用户管理"
        extra={
          <Space>
            <Button onClick={handleResetFilters}>重置筛选</Button>
            <Button onClick={() => void loadData()}>刷新</Button>
            <Button
              danger
              disabled={selectedIds.length === 0}
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>
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
              <Button type="primary" htmlType="submit">查询</Button>
              <Button onClick={handleResetFilters}>清空</Button>
            </Space>
          </Form.Item>
        </Form>

        <Table<UserVO>
          rowKey="id"
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          rowSelection={rowSelection}
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (tot) => `共 ${tot} 条`,
          }}
          scroll={{ x: 960 }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()} loading={loading}>
            {editingUser ? '保存' : '创建'}
          </Button>,
        ]}
        destroyOnClose
        maskClosable={false}
      >
        <Form<UserCreateParams>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 0 }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: !editingUser, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" disabled={Boolean(editingUser)} />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}

          <Form.Item
            name="roleId"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Select.Option value={1}>管理员</Select.Option>
              <Select.Option value={2}>普通用户</Select.Option>
              <Select.Option value={3}>访客</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value={0}>启用</Select.Option>
              <Select.Option value={1}>禁用</Select.Option>
              <Select.Option value={2}>锁定</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
