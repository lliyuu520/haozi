'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Avatar,
  Tooltip,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { DataTable, DataTableProps } from '@/components/ui/DataTable';
import { UserVO, UserQuery, UserCreateParams, UserUpdateParams } from '@/services/user';
import { useAuthStore } from '@/stores/authStore';

const { Text } = Typography;

export default function UserManagementPage() {
  const router = useRouter();
  const { userInfo } = useAuthStore();

  // 状态管理
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserVO | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<UserQuery>({});
  const [dataSource, setDataSource] = useState<UserVO[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 表单
  const [form] = Form.useForm();

  // 搜索表单配置
  const searchFormConfig = [
    {
      name: 'username',
      placeholder: '用户名',
    },
    {
      name: 'nickname',
      placeholder: '昵称',
    },
    {
      name: 'email',
      placeholder: '邮箱',
    },
    {
      name: 'phone',
      placeholder: '手机号',
    },
    {
      name: 'status',
      placeholder: '状态',
      type: 'select',
      options: [
        { label: '全部', value: undefined },
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
        { label: '锁定', value: 2 },
      ],
    },
    {
      name: 'roleId',
      placeholder: '角色',
      type: 'select',
    },
  ];

  // 表格列配置
  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 80,
      render: (avatar: string) => (
        <Avatar src={avatar} icon={<UserOutlined />} />
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
      render: (username: string) => (
        <Text strong>{username}</Text>
      ),
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: 120,
      render: (nickname: string) => <Text>{nickname}</Text>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
      render: (email: string) => <Text>{email}</Text>,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
      render: (phone: string) => <Text>{phone}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number, record: UserVO) => {
        let statusText = '';
        let color = '';

        switch (status) {
          case 0:
            statusText = '启用';
            color = 'success';
            break;
          case 1:
            statusText = '禁用';
            color = 'error';
            break;
          case 2:
            statusText = '锁定';
            color = 'warning';
            break;
        }

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      width: 120,
      render: (roleName: string) => <Text>{roleName}</Text>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160,
      render: (time: string) => <Text>{time}</Text>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record: UserVO) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确认删除"
              description="确定要删除这条记录吗？"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 处理搜索
  const handleSearch = (params: UserQuery) => {
    setSearchParams(params);
  };

  // 处理刷新
  const handleRefresh = () => {
    loadData();
  };

  // 处理新增
  const handleAdd = () => {
    setEditingUser({});
    setIsModalVisible(true);
    form.resetFields();
  };

  // 处理编辑
  const handleEdit = (record: UserVO) => {
    setEditingUser(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      username: record.username,
      nickname: record.nickname,
      email: record.email,
      phone: record.phone,
      status: record.status,
      roleId: record.roleId,
    });
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: UserCreateParams) => {
    setLoading(true);
    try {
      if (editingUser?.id) {
        // 更新用户
        const updateParams: UserUpdateParams = {
          id: editingUser.id,
          ...values,
        };
        await updateUser(updateParams);
        message.success('更新成功');
      } else {
        // 新增用户
        await createUser(values);
        message.success('创建成功');
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
      loadData();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserPage({
        ...searchParams,
        current,
        size: pageSize,
      });

      if (response?.data) {
        setDataSource(response.data.records || []);
        setTotal(response.data.total || 0);
        setCurrent(response.data.current || 1);
        setPageSize(response.data.size || 10);
      }
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams, current, pageSize]);

  // 初始化数据
  useEffect(() => {
    loadData();
  }, []);

  // 监听分页变化
  useEffect(() => {
    loadData();
  }, [current, pageSize]);

  const tableProps: DataTableProps<UserVO> = {
    columns,
    dataSource,
    loading,
    pagination: {
      current,
      pageSize,
      total,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: (page, size) => {
        setCurrent(page);
        setPageSize(size || 10);
      },
    },
    searchParams,
    onSearch: handleSearch,
    actions: {
      add: handleAdd,
      refresh: handleRefresh,
      delete: async (selectedRows) => {
        const ids = selectedRows.map((row: any) => row.id);
        if (ids.length === 0) return;

        try {
          await batchDeleteUsers(ids);
          message.success(`成功删除 ${ids.length} 条记录`);
          loadData();
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    },
    tableActions: {
      edit: handleEdit,
      delete: handleDelete,
    },
  };

  return (
    <div className="page-container">
      <Card
        title="用户管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增用户
          </Button>
        }
      >
        <DataTable<UserVO>
          {...tableProps}
        />
      </Card>

      {/* 新增/编辑用户模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={[
          <Button onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button type="primary" onClick={() => form.submit()} loading={loading}>
            {editingUser ? '更新' : '创建'}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
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
            rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={editingUser ? [] : [{ required: true, message: '请输入密码' }]}
            >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

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

          <Form.Item
            name="status"
            label="状态"
            initialValue={1}
          >
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
              <Select.Option value={2}>锁定</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}