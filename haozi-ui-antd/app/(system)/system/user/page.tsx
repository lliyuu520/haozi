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
  Spin,
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
  getUserDetail,
} from '@/services/user';
import { getRoleList, RoleVO } from '@/services/role';

const { Text } = Typography;

const STATUS_TAG: Record<number, { label: string; color: 'success' | 'error' | 'warning' }> = {
  0: { label: '启用', color: 'success' },
  1: { label: '禁用', color: 'error' },
  2: { label: '锁定', color: 'warning' },
};

interface UserFormValues {
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  password?: string;
  roleId?: number;
  status?: number;
}

export default function UserManagementPage() {
  const [filterForm] = Form.useForm<UserQuery>();
  const [form] = Form.useForm<UserFormValues>();
  const [dataSource, setDataSource] = useState<UserVO[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<UserQuery>({});
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [roleOptions, setRoleOptions] = useState<RoleVO[]>([]);

  const loadRoles = useCallback(async () => {
    try {
      const response = await getRoleList();
      setRoleOptions(response.data?.data ?? []);
    } catch (error) {
      console.error(error);
      message.error('加载角色列表失败，请稍后重试');
    }
  }, []);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

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
    setEditingUserId(null);
    setIsModalVisible(true);
    form.resetFields();
    form.setFieldsValue({ status: 0 });
  };

  const handleEdit = useCallback(async (record: UserVO) => {
    setDetailLoading(true);
    try {
      const response = await getUserDetail(record.id);
      const detail = response.data?.data;
      if (!detail) {
        throw new Error('用户详情为空');
      }
      setEditingUserId(detail.id);
      form.setFieldsValue({
        username: detail.username,
        nickname: detail.nickname,
        email: detail.email,
        phone: detail.phone,
        status: detail.status ?? 0,
        roleId: detail.roleIdList?.[0],
      });
      setIsModalVisible(true);
    } catch (error) {
      console.error(error);
      message.error('获取用户详情失败，请稍后再试');
    } finally {
      setDetailLoading(false);
    }
  }, []);

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

  const handleSubmit = async (values: UserFormValues) => {
    const roleIdList = values.roleId ? [values.roleId] : [];
    const commonPayload = {
      nickname: values.nickname,
      email: values.email,
      phone: values.phone,
      status: values.status ?? 0,
      roleIdList,
      avatar: undefined,
    };
    setSaving(true);
    try {
      if (editingUserId) {
        const params: UserUpdateParams = {
          id: editingUserId,
          username: values.username,
          ...commonPayload,
        };
        if (values.password) {
          params.password = values.password;
        }
        await updateUser(params);
        message.success('更新成功');
      } else {
        if (!values.password) {
          message.error('请输入密码');
          setSaving(false);
          return;
        }
        const params: UserCreateParams = {
          username: values.username,
          password: values.password,
          ...commonPayload,
        };
        await createUser(params);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      setEditingUserId(null);
      form.resetFields();
      void loadData();
    } catch (error) {
      console.error(error);
      message.error(editingUserId ? '更新失败，请稍后再试' : '创建失败，请稍后再试');
    } finally {
      setSaving(false);
    }
  };

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

      <Modal
        title={editingUserId ? '编辑用户' : '新建用户'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUserId(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
        maskClosable={false}
      >
        <Spin spinning={detailLoading && !!editingUserId}>
          <Form<UserFormValues>
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ status: 0 }}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" disabled={Boolean(editingUserId)} />
            </Form.Item>

            <Form.Item
              name="nickname"
              label="昵称"
              rules={[{ required: true, message: '请输入昵称' }]}
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>

            <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '请输入有效邮箱' }]}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item name="phone" label="手机号">
              <Input placeholder="请输入手机号" />
            </Form.Item>

            {!editingUserId && (
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
              <Select placeholder="请选择角色" loading={roleOptions.length === 0}>
                {roleOptions.map(role => (
                  <Select.Option key={role.id} value={role.id}>
                    {role.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="status" label="状态">
              <Select>
                <Select.Option value={0}>启用</Select.Option>
                <Select.Option value={1}>禁用</Select.Option>
                <Select.Option value={2}>锁定</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setIsModalVisible(false)}>取消</Button>
                <Button type="primary" loading={saving} onClick={() => form.submit()}>
                  {editingUserId ? '保存' : '创建'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}
