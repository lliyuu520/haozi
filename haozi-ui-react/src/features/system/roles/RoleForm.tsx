import { Form, Input, Modal, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useEffect } from 'react';
import type { MenuTreeNode, RolePayload, RoleRecord } from '@/features/system/roles/api';

type RoleFormProps = {
  open: boolean;
  submitting: boolean;
  menuTree: MenuTreeNode[];
  initialValues?: RoleRecord | null;
  onCancel: () => void;
  onSubmit: (values: RolePayload) => void;
};

/**
 * 角色新增/编辑表单。
 *
 * 菜单权限保存时提交全选和半选节点，保持与旧 Vue 版本一致，避免父级目录权限丢失。
 */
export function RoleForm({
  open,
  submitting,
  menuTree,
  initialValues,
  onCancel,
  onSubmit,
}: RoleFormProps) {
  const [form] = Form.useForm<RolePayload>();
  const treeData = toTreeData(menuTree);
  const isEdit = Boolean(initialValues?.id);

  useEffect(() => {
    if (!open) {
      return;
    }
    form.setFieldsValue({
      name: initialValues?.name ?? '',
      menuIdList: initialValues?.menuIdList ?? [],
    });
  }, [form, initialValues, open]);

  return (
    <Modal
      title={isEdit ? '编辑角色' : '新增角色'}
      open={open}
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={680}
      destroyOnHidden
    >
      <Form<RolePayload> form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="name" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
          <Input autoComplete="off" maxLength={64} />
        </Form.Item>
        <Form.Item name="menuIdList" label="菜单权限">
          <Tree
            checkable
            defaultExpandAll
            treeData={treeData}
            checkedKeys={form.getFieldValue('menuIdList') ?? []}
            onCheck={(_, info) => {
              const checked = info.checkedNodes.map(node => Number(node.key));
              const halfChecked = (info.halfCheckedKeys ?? []).map(key => Number(key));
              form.setFieldValue('menuIdList', [...new Set([...checked, ...halfChecked])]);
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

/**
 * 将后端菜单树转换为 AntD Tree 数据。
 *
 * @param nodes 后端菜单树
 * @returns AntD Tree 节点
 */
function toTreeData(nodes: MenuTreeNode[]): DataNode[] {
  return nodes.map(node => ({
    key: node.id,
    title: node.name,
    children: toTreeData(node.children ?? []),
  }));
}
