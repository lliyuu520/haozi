import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Space, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import { Auth } from '@/components/Auth/Auth';
import {
  createMenu,
  deleteMenu,
  getMenu,
  listMenus,
  updateMenu,
  type MenuPayload,
  type MenuResource,
} from '@/features/system/menus/api';
import { MenuForm } from '@/features/system/menus/MenuForm';

const MENU_QUERY_KEY = ['system', 'menus'];

const typeMeta = {
  0: { color: 'blue', label: '菜单' },
  1: { color: 'green', label: '按钮' },
  2: { color: 'orange', label: '接口' },
} as const;

export default function MenuPage() {
  const queryClient = useQueryClient();
  const { message, modal } = App.useApp();
  const [editingMenu, setEditingMenu] = useState<MenuResource | null>(null);
  const [parentPreset, setParentPreset] = useState<Pick<MenuResource, 'id' | 'name'> | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const menusQuery = useQuery({
    queryKey: MENU_QUERY_KEY,
    queryFn: listMenus,
  });

  const refreshMenus = () => {
    queryClient.invalidateQueries({ queryKey: MENU_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ['system', 'roles', 'menu-tree'] });
  };

  const createMutation = useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      message.success('新增菜单资源成功');
      setFormOpen(false);
      setParentPreset(null);
      refreshMenus();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MenuPayload }) => updateMenu(id, payload),
    onSuccess: () => {
      message.success('更新菜单资源成功');
      setFormOpen(false);
      setEditingMenu(null);
      refreshMenus();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      message.success('删除菜单资源成功');
      refreshMenus();
    },
  });

  const openCreate = (parent?: MenuResource) => {
    setEditingMenu(null);
    setParentPreset(parent ? { id: parent.id, name: parent.name } : null);
    setFormOpen(true);
  };

  const openEdit = async (record: MenuResource) => {
    const detail = await getMenu(record.id);
    setParentPreset(null);
    setEditingMenu(detail);
    setFormOpen(true);
  };

  const columns: TableProps<MenuResource>['columns'] = [
    {
      title: '资源名称',
      dataIndex: 'name',
      minWidth: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: type => {
        const meta = typeMeta[type as keyof typeof typeMeta] ?? typeMeta[0];
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: '排序',
      dataIndex: 'weight',
      width: 90,
    },
    {
      title: '路由',
      dataIndex: 'url',
      ellipsis: true,
      render: value => value || '-',
    },
    {
      title: '授权标识',
      dataIndex: 'perms',
      ellipsis: true,
      render: value => value || '-',
    },
    {
      title: '操作',
      key: 'actions',
      width: 260,
      render: (_, record) => (
        <Space>
          <Auth code="sys:menu:save">
            <Button type="link" icon={<PlusOutlined />} onClick={() => openCreate(record)}>
              新增子级
            </Button>
          </Auth>
          <Auth code="sys:menu:update">
            <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>
              编辑
            </Button>
          </Auth>
          <Auth code="sys:menu:delete">
            <Button
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => {
                modal.confirm({
                  title: '删除菜单资源',
                  content: `确定删除菜单资源「${record.name}」吗？存在子资源时需要先删除子资源。`,
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

  const handleSubmit = (values: MenuPayload) => {
    if (editingMenu) {
      updateMutation.mutate({ id: editingMenu.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div className="page-stack">
      <Typography.Title level={2}>菜单资源</Typography.Title>
      <Card>
        <Space>
          <Auth code="sys:menu:save">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate()}>
              新增资源
            </Button>
          </Auth>
          <Button icon={<ReloadOutlined />} onClick={refreshMenus}>
            刷新
          </Button>
        </Space>
      </Card>
      <Card
        title={
          <Space>
            <BranchesOutlined />
            <span>资源树</span>
          </Space>
        }
      >
        <Table<MenuResource>
          rowKey="id"
          columns={columns}
          loading={menusQuery.isFetching}
          dataSource={menusQuery.data ?? []}
          pagination={false}
        />
      </Card>
      <MenuForm
        open={formOpen}
        submitting={createMutation.isPending || updateMutation.isPending}
        menuTree={menusQuery.data ?? []}
        initialValues={editingMenu}
        parentPreset={parentPreset}
        onCancel={() => {
          setFormOpen(false);
          setEditingMenu(null);
          setParentPreset(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
