import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Form, Input, Space, Table } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import { Auth } from '@/components/Auth/Auth';
import { PageContainer } from '@/components/PageContainer/PageContainer';
import { SearchForm } from '@/components/SearchForm/SearchForm';
import {
  createRole,
  deleteRole,
  getRole,
  getRoleMenuTree,
  listRoles,
  updateRole,
  type RolePayload,
  type RoleQuery,
  type RoleRecord,
} from '@/features/system/roles/api';
import { RoleForm } from '@/features/system/roles/RoleForm';

const ROLE_QUERY_KEY = ['system', 'roles'];

export default function RolePage() {
  const queryClient = useQueryClient();
  const { message, modal } = App.useApp();
  const [form] = Form.useForm<Pick<RoleQuery, 'name'>>();
  const [query, setQuery] = useState<RoleQuery>({ page: 1, pageSize: 10 });
  const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const rolesQuery = useQuery({
    queryKey: [...ROLE_QUERY_KEY, query],
    queryFn: () => listRoles(query),
  });

  const menuTreeQuery = useQuery({
    queryKey: ['system', 'roles', 'menu-tree'],
    queryFn: getRoleMenuTree,
  });

  const refreshRoles = () => {
    queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEY });
  };

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      message.success('新增角色成功');
      setFormOpen(false);
      refreshRoles();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RolePayload }) => updateRole(id, payload),
    onSuccess: () => {
      message.success('更新角色成功');
      setFormOpen(false);
      setEditingRole(null);
      refreshRoles();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      message.success('删除角色成功');
      refreshRoles();
    },
  });

  const columns: TableProps<RoleRecord>['columns'] = [
    {
      title: '角色ID',
      dataIndex: 'id',
      width: 180,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Auth code="sys:role:update">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={async () => {
                const detail = await getRole(record.id);
                setEditingRole(detail);
                setFormOpen(true);
              }}
            >
              编辑
            </Button>
          </Auth>
          <Auth code="sys:role:delete">
            <Button
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => {
                modal.confirm({
                  title: '删除角色',
                  content: `确定删除角色「${record.name}」吗？`,
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

  const handleSearch = (values: Pick<RoleQuery, 'name'>) => {
    setQuery(current => ({ ...current, ...values, page: 1 }));
  };

  const handleSubmit = (values: RolePayload) => {
    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <PageContainer title="角色管理">
      <SearchForm<Pick<RoleQuery, 'name'>> form={form} onFinish={handleSearch}>
        <Form.Item name="name" label="角色名称">
          <Input allowClear placeholder="请输入角色名称" />
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
        title="角色列表"
        extra={
          <Auth code="sys:role:save">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRole(null);
                setFormOpen(true);
              }}
            >
              新增角色
            </Button>
          </Auth>
        }
      >
        <Table<RoleRecord>
          rowKey="id"
          columns={columns}
          loading={rolesQuery.isFetching}
          dataSource={rolesQuery.data?.items ?? []}
          scroll={{ x: 680 }}
          pagination={{
            current: query.page,
            pageSize: query.pageSize,
            total: rolesQuery.data?.total ?? 0,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
            onChange: (page, pageSize) => setQuery(current => ({ ...current, page, pageSize })),
          }}
        />
      </Card>
      <RoleForm
        open={formOpen}
        submitting={createMutation.isPending || updateMutation.isPending}
        menuTree={menuTreeQuery.data ?? []}
        initialValues={editingRole}
        onCancel={() => {
          setFormOpen(false);
          setEditingRole(null);
        }}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
