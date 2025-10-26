'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tooltip,
  message,
  Spin,
  Tree,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  RoleVO,
  RoleQuery,
  RoleCreateParams,
  RoleUpdateParams,
  getRolePage,
  createRole,
  updateRole,
  deleteRole,
  getRoleDetail,
} from '@/services/role';
import { getMenuList, MenuTreeNode } from '@/services/menu';

interface RoleFormValues {
  name: string;
  remark?: string;
  menuIdList?: number[];
}

const buildTreeData = (menus: MenuTreeNode[]): DataNode[] =>
  menus.map(menu => ({
    key: menu.id,
    title: menu.name,
    children: menu.children ? buildTreeData(menu.children) : undefined,
  }));

export default function RoleManagementPage() {
  const [filterForm] = Form.useForm<RoleQuery>();
  const [form] = Form.useForm<RoleFormValues>();
  const [dataSource, setDataSource] = useState<RoleVO[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<RoleQuery>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [menuTree, setMenuTree] = useState<DataNode[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);

  const loadMenus = useCallback(async () => {
    setMenuLoading(true);
    try {
      const response = await getMenuList();
      const menus = response.data ?? [];
      setMenuTree(buildTreeData(menus));
    } catch (error) {
      console.error(error);
      message.error('加载菜单数据失败，请稍后重试');
    } finally {
      setMenuLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMenus();
  }, [loadMenus]);

  const loadData = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await getRolePage({
        ...searchParams,
        page: current,
        limit: pageSize,
      });
      const pageData = response.data?.data;
      setDataSource(pageData?.list ?? []);
      setTotal(pageData?.total ?? 0);
    } catch (error) {
      console.error(error);
      message.error('加载角色数据失败，请稍后重试');
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

  const handleSearch = (values: RoleQuery) => {
    setSearchParams(values);
    setCurrent(1);
  };

  const handleResetFilters = () => {
    filterForm.resetFields();
    setSearchParams({});
    setCurrent(1);
  };

  const handleAdd = () => {
    setEditingRoleId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = useCallback(async (record: RoleVO) => {
    try {
      const response = await getRoleDetail(record.id);
      const detail = response.data?.data;
      if (!detail) {
        throw new Error('角色详情为空');
      }
      setEditingRoleId(detail.id);
      form.setFieldsValue({
        name: detail.name,
        remark: detail.remark,
        menuIdList: detail.menuIdList,
      });
      setIsModalVisible(true);
    } catch (error) {
      console.error(error);
      message.error('获取角色详情失败，请稍后再试');
    }
  }, [form]);

  const handleDelete = useCallback((roleId: number) => {
    Modal.confirm({
      title: '删除角色',
      content: '确认删除该角色吗？删除后关联权限将失效。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteRole(roleId);
          message.success('删除成功');
          void loadData();
        } catch (error) {
          console.error(error);
          message.error('删除失败，请稍后再试');
        }
      },
    });
  }, [loadData]);

  const handleSubmit = async (values: RoleFormValues) => {
    const payload = {
      name: values.name,
      remark: values.remark,
      menuIdList: values.menuIdList ?? [],
    };
    setSaving(true);
    try {
      if (editingRoleId) {
        const params: RoleUpdateParams = {
          id: editingRoleId,
          ...payload,
        };
        await updateRole(params);
        message.success('更新成功');
      } else {
        const params: RoleCreateParams = { ...payload };
        await createRole(params);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      setEditingRoleId(null);
      form.resetFields();
      void loadData();
    } catch (error) {
      console.error(error);
      message.error(editingRoleId ? '更新失败，请稍后再试' : '创建失败，请稍后再试');
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnsType<RoleVO> = useMemo(
    () => [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 260,
        render: (remark?: string) => remark || '-',
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
              <Button type="link" icon={<EditOutlined />} onClick={() => void handleEdit(record)} />
            </Tooltip>
            <Tooltip title="删除">
              <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleDelete, handleEdit],
  );

  const checkedMenuIds = form.getFieldValue('menuIdList') ?? [];

  return (
    <div className="page-container">
      <Card
        title="角色管理"
        extra={
          <Space>
            <Button onClick={handleResetFilters}>重置筛选</Button>
            <Button onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建角色
            </Button>
          </Space>
        }
      >
        <Form<RoleQuery>
          form={filterForm}
          layout="inline"
          onFinish={handleSearch}
          className="mb-4"
        >
          <Form.Item name="name" label="角色名称">
            <Input allowClear placeholder="请输入角色名称" />
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

        <Table<RoleVO>
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
          scroll={{ x: 720 }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingRoleId ? '编辑角色' : '新建角色'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRoleId(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
        maskClosable={false}
        width={560}
      >
        <Form<RoleFormValues> form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" maxLength={100} showCount />
          </Form.Item>

          <Form.Item name="menuIdList" label="菜单权限">
            <Spin spinning={menuLoading}>
              <Tree
                checkable
                selectable={false}
                checkedKeys={checkedMenuIds}
                onCheck={checked => {
                  const keys = Array.isArray(checked) ? checked : checked.checked;
                  form.setFieldsValue({ menuIdList: keys.map(key => Number(key)) });
                }}
                treeData={menuTree}
                height={360}
              />
            </Spin>
          </Form.Item>

          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)}>取消</Button>
              <Button type="primary" loading={saving} onClick={() => form.submit()}>
                {editingRoleId ? '保存' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
