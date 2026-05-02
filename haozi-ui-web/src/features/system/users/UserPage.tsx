import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Form, Input, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import { Auth } from '@/components/Auth/Auth';
import { PageContainer } from '@/components/PageContainer/PageContainer';
import { SearchForm } from '@/components/SearchForm/SearchForm';
import {
  createUser,
  deleteUser,
  listRoleOptions,
  listUsers,
  updateUser,
  type UserPayload,
  type UserQuery,
  type UserRecord,
} from '@/features/system/users/api';
import { UserForm } from '@/features/system/users/UserForm';

const USER_QUERY_KEY = ['system', 'users'];

export default function UserPage() {
  const queryClient = useQueryClient();
  const { message, modal } = App.useApp();
  const [form] = Form.useForm<Pick<UserQuery, 'username'>>();
  const [query, setQuery] = useState<UserQuery>({ page: 1, pageSize: 10 });
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const usersQuery = useQuery({
    queryKey: [...USER_QUERY_KEY, query],
    queryFn: () => listUsers(query),
  });

  const roleOptionsQuery = useQuery({
    queryKey: ['system', 'users', 'role-options'],
    queryFn: listRoleOptions,
  });

  const refreshUsers = () => {
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
  };

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      message.success('新增用户成功');
      setFormOpen(false);
      refreshUsers();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UserPayload }) => updateUser(id, payload),
    onSuccess: () => {
      message.success('更新用户成功');
      setFormOpen(false);
      setEditingUser(null);
      refreshUsers();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      message.success('删除用户成功');
      refreshUsers();
    },
  });

  const columns: TableProps<UserRecord>['columns'] = [
    {
      title: '用户ID',
      dataIndex: 'id',
      width: 220,
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '角色',
      dataIndex: 'roleIdList',
      render: roleIds => {
        const roleOptions = roleOptionsQuery.data ?? [];
        const names = (roleIds ?? [])
          .map((id: number) => roleOptions.find(role => role.id === id)?.name)
          .filter(Boolean)
          .join('、');
        return names || '-';
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Auth code="sys:user:update">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingUser(record);
                setFormOpen(true);
              }}
            >
              编辑
            </Button>
          </Auth>
          <Auth code="sys:user:delete">
            <Button
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => {
                modal.confirm({
                  title: '删除用户',
                  content: `确定删除用户「${record.username}」吗？`,
                  okText: '删除',
                  okButtonProps: { danger: true },
                  cancelText: '取消',
                  onOk: () => deleteMutation.mutateAsync(record.id),
                });
              }}
            >
              删除
            </Button>
          </Auth>
        </Space>
      ),
    },
  ];

  const handleSearch = (values: Pick<UserQuery, 'username'>) => {
    setQuery(current => ({ ...current, ...values, page: 1 }));
  };

  const handleSubmit = (values: UserPayload) => {
    const payload = {
      ...values,
      password: values.password?.trim() || undefined,
    };
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <PageContainer title="用户管理">
      <SearchForm<Pick<UserQuery, 'username'>> form={form} onFinish={handleSearch}>
        <Form.Item name="username" label="用户名">
          <Input allowClear placeholder="请输入用户名" />
        </Form.Item>
        <Space className="search-form__actions">
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              form.resetFields();
              setQuery({ page: 1, pageSize: query.pageSize });
            }}
          >
            重置
          </Button>
        </Space>
      </SearchForm>
      <Card
        className="table-card"
        title="用户列表"
        extra={
          <Auth code="sys:user:save">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingUser(null);
                setFormOpen(true);
              }}
            >
              新增用户
            </Button>
          </Auth>
        }
      >
        <Table<UserRecord>
          rowKey="id"
          columns={columns}
          loading={usersQuery.isFetching}
          dataSource={usersQuery.data?.items ?? []}
          scroll={{ x: 760 }}
          pagination={{
            current: query.page,
            pageSize: query.pageSize,
            total: usersQuery.data?.total ?? 0,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
            onChange: (page, pageSize) => setQuery(current => ({ ...current, page, pageSize })),
          }}
        />
      </Card>
      <UserForm
        open={formOpen}
        submitting={createMutation.isPending || updateMutation.isPending}
        roleOptions={roleOptionsQuery.data ?? []}
        initialValues={editingUser}
        onCancel={() => {
          setFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
