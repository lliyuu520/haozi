'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Form,
  Input,
  Button,
  Space,
  Tooltip,
  Tree,
  Card,
  type TreeProps,
} from 'antd';

import { InfoCircleOutlined, SafetyOutlined } from '@ant-design/icons';

import {
  getRoleDetail,
  createRole,
  updateRole,
  getRoleMenuTree,
} from '@/services/roleService';

import {
  type RoleFormValues,
  type RoleUpdateParams,
  type RoleCreateParams,
  type MenuPermissionNode,
} from '@/types/role';

const DEFAULT_FORM_VALUES: RoleFormValues = {
  name: '',
};

interface RoleFormProps {
  mode: 'create' | 'edit' | 'view';

  roleId: string;

  onSuccess: () => void;

  onCancel: () => void;

  defaultValues?: Partial<RoleFormValues>;
}

export default function RoleForm({
  mode,

  roleId,

  onSuccess,

  onCancel,

  defaultValues,
}: RoleFormProps) {
  const [form] = Form.useForm<RoleFormValues>();

  const [loading, setLoading] = useState(false);

  const [menuTreeData, setMenuTreeData] = useState<MenuPermissionNode[]>([]);

  const [checkedMenuKeys, setCheckedMenuKeys] = useState<string[]>([]);

  const isReadOnly = mode === 'view';

  const isEdit = mode === 'edit';

  // 转换菜单数据为树形选择结构
  const convertToTreeData = useCallback((menus: any): MenuPermissionNode[] => {
    const normalizedMenus = Array.isArray(menus) ? menus : menus ? [menus] : [];

    return normalizedMenus.map((menu) => {
      const rawId = menu?.id ?? menu?.key ?? menu?.value ?? menu?.menuId;

      const key = rawId != null ? rawId.toString() : '';

      const title = menu?.title ?? menu?.name ?? menu?.label ?? '';

      const childrenSource =
        menu?.children ?? menu?.childList ?? menu?.nodes ?? menu?.items ?? [];

      const node: MenuPermissionNode = {
        id: key,

        name: title,

        key,

        title,

        checkable: true,
      };

      if (Array.isArray(childrenSource) && childrenSource.length > 0) {
        node.children = convertToTreeData(childrenSource);
      }

      return node;
    });
  }, []);

  // 加载菜单树数据

  const loadMenuTree = useCallback(async () => {
    try {
      const menuData = await getRoleMenuTree();
      const treeData = convertToTreeData(menuData);
      setMenuTreeData(treeData);
    } catch (error) {
      console.error('加载菜单树失败:', error);
    }
  }, [convertToTreeData]);

  // 加载角色详情（编辑模式和查看模式）

  const loadRoleDetail = useCallback(async () => {
    if (!isEdit && !isReadOnly) return;

    if (!roleId) return;

    try {
      const roleDetail = await getRoleDetail(roleId);

      if (!roleDetail) {
        throw new Error('角色详情为空');
      }

      const normalizedMenuIds =
        roleDetail.menuIdList?.map((id) => id.toString()) ?? [];

      form.setFieldsValue({
        ...DEFAULT_FORM_VALUES,

        name: roleDetail.name,

        menuIdList: normalizedMenuIds,
      });

      // 更新当前选中的菜单权限

      if (normalizedMenuIds.length > 0) {
        setCheckedMenuKeys(normalizedMenuIds);
      } else {
        setCheckedMenuKeys([]);
      }
    } catch (error) {
      console.error('加载角色详情失败:', error);
    }
  }, [roleId, form]);

  // 根据模式/ID 变更重构菜单树，避免 App Router 复用组件时出现附归数据
  useEffect(() => {
    void loadMenuTree();
  }, [loadMenuTree, roleId, mode]);

  // 当roleId或mode变化时，重新加载角色详情或设置默认值
  useEffect(() => {
    if (isEdit || isReadOnly) {
      void loadRoleDetail();
    } else {
      // 创建模式的默认值
      form.resetFields();
      setCheckedMenuKeys([]);
      form.setFieldsValue({
        ...DEFAULT_FORM_VALUES,
        ...defaultValues,
      });
    }
  }, [roleId, mode, isEdit, isReadOnly, defaultValues, form]);

  // 处理菜单选择变化
  const handleMenuCheck: TreeProps['onCheck'] = (checkedKeys) => {
    const normalizedKeys = Array.isArray(checkedKeys)
      ? checkedKeys
      : checkedKeys.checked;

    setCheckedMenuKeys(normalizedKeys.map((key) => key.toString()));
  };

  // 提交表单

  const handleSubmit = async (values: RoleFormValues) => {
    if (isReadOnly) return;

    setLoading(true);

    try {
      const params: RoleCreateParams | RoleUpdateParams = {
        ...values,
        menuIdList: checkedMenuKeys,
      };

      if (isEdit && roleId) {
        await updateRole({ ...params, id: roleId } as RoleUpdateParams);
      } else {
        await createRole(params as RoleCreateParams);
      }

      onSuccess();
    } catch (error) {
      console.error('角色操作失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
      <Form<RoleFormValues>
        form={form}
        layout='vertical'
        onFinish={isReadOnly ? undefined : handleSubmit}
        style={{ paddingRight: '8px' }}
      >
        <Form.Item
          name='name'
          label='角色名称'
          rules={[
            { required: !isReadOnly, message: '请输入角色名称' },

            { min: 2, max: 50, message: '角色名称长度应在2-50个字符之间' },
          ]}
          tooltip='角色的显示名称，用于系统内展示'
        >
          <Input
            placeholder='请输入角色名称'
            showCount
            maxLength={50}
            readOnly={isReadOnly}
          />
        </Form.Item>

        {/* 菜单权限选择 */}

        <Form.Item label='菜单权限'>
          <Card
            size='small'
            title={
              <Space>
                <SafetyOutlined />

                <span>选择菜单权限</span>

                <Tooltip title='选择该角色可以访问的菜单和功能按钮'>
                  <InfoCircleOutlined className='text-gray-400' />
                </Tooltip>
              </Space>
            }
            style={{ marginBottom: 0 }}
          >
            <Tree
              checkable
              checkedKeys={checkedMenuKeys}
              onCheck={handleMenuCheck}
              treeData={menuTreeData}
              height={300}
              disabled={isReadOnly}
              showLine
              defaultExpandAll
              style={{ minHeight: 200 }}
            />
          </Card>
        </Form.Item>

        <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>{isReadOnly ? '关闭' : '取消'}</Button>

            {!isReadOnly && (
              <Button
                type='primary'
                loading={loading}
                onClick={() => form.submit()}
              >
                {isEdit ? '更新' : '创建'}
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
