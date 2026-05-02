import { Col, Divider, Form, Input, InputNumber, Modal, Radio, Row, TreeSelect } from 'antd';
import { useEffect } from 'react';
import { IconGridPicker } from '@/features/system/menus/IconGridPicker';
import type { MenuPayload, MenuResource, MenuType } from '@/features/system/menus/api';

type MenuFormProps = {
  open: boolean;
  submitting: boolean;
  menuTree: MenuResource[];
  initialValues?: MenuResource | null;
  parentPreset?: Pick<MenuResource, 'id' | 'name'> | null;
  onCancel: () => void;
  onSubmit: (values: MenuPayload) => void;
};

type TreeSelectNode = {
  title: string;
  value: number;
  key: number;
  disabled?: boolean;
  children?: TreeSelectNode[];
};

/**
 * 菜单资源新增/编辑表单。
 *
 * 菜单路由直接保存 React path，按钮和接口权限继续写入 perms 供后端权限校验。
 */
export function MenuForm({
  open,
  submitting,
  menuTree,
  initialValues,
  parentPreset,
  onCancel,
  onSubmit,
}: MenuFormProps) {
  const [form] = Form.useForm<MenuPayload>();
  const selectedType = Form.useWatch('type', form) ?? initialValues?.type ?? 0;
  const isEdit = Boolean(initialValues?.id);
  const treeData = [
    {
      title: '一级菜单',
      value: 0,
      key: 0,
      children: toTreeSelectData(menuTree, initialValues?.id),
    },
  ];

  useEffect(() => {
    if (!open) {
      return;
    }
    form.setFieldsValue({
      parentId: parentPreset?.id ?? initialValues?.parentId ?? 0,
      name: initialValues?.name ?? '',
      type: initialValues?.type ?? 0,
      url: initialValues?.url ?? '',
      icon: initialValues?.icon ?? '',
      perms: initialValues?.perms ?? '',
      openStyle: initialValues?.openStyle ?? 0,
      weight: initialValues?.weight ?? 0,
    });
  }, [form, initialValues, open, parentPreset]);

  return (
    <Modal
      title={isEdit ? '编辑菜单资源' : parentPreset ? `新增「${parentPreset.name}」子资源` : '新增菜单资源'}
      open={open}
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={900}
      destroyOnHidden
    >
      <Form<MenuPayload>
        form={form}
        layout="vertical"
        onFinish={values => onSubmit(normalizePayload(values))}
        onValuesChange={changed => {
          if ('type' in changed && changed.type !== 0) {
            form.setFieldValue('url', '');
            form.setFieldValue('icon', '');
          }
        }}
      >
        <Divider titlePlacement="start" plain>
          基础信息
        </Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="type" label="资源类型" rules={[{ required: true, message: '请选择资源类型' }]}>
              <Radio.Group disabled={isEdit}>
                <Radio.Button value={0}>菜单</Radio.Button>
                <Radio.Button value={1}>按钮</Radio.Button>
                <Radio.Button value={2}>接口</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="weight" label="排序" rules={[{ required: true, message: '请输入排序' }]}>
              <InputNumber min={0} precision={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="name" label="资源名称" rules={[{ required: true, message: '请输入资源名称' }]}>
              <Input autoComplete="off" maxLength={64} placeholder="例如：用户管理、删除用户" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="parentId" label="上级资源" rules={[{ required: true, message: '请选择上级资源' }]}>
              <TreeSelect
                treeData={treeData}
                treeDefaultExpandAll
                placeholder="请选择上级资源"
              />
            </Form.Item>
          </Col>
        </Row>
        {selectedType === 0 && (
          <>
            <Divider titlePlacement="start" plain>
              菜单展示
            </Divider>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="url" label="菜单路由" rules={[{ required: true, message: '请输入菜单路由' }]}>
                  <Input autoComplete="off" placeholder="例如：/system/users" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="icon" label="菜单图标" tooltip="保存 Ant Design 图标组件名称，用于界面展示">
                  <IconGridPicker />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
        <Divider titlePlacement="start" plain>
          权限配置
        </Divider>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="perms"
              label="授权标识"
              tooltip="多个权限码使用英文逗号分隔，例如 sys:menu:update,sys:menu:info"
              rules={selectedType === 0 ? [] : [{ required: true, message: '请输入授权标识' }]}
            >
              <Input autoComplete="off" placeholder="例如：sys:menu:save" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="openStyle" label="打开方式" rules={[{ required: true, message: '请选择打开方式' }]}>
              <Radio.Group>
                <Radio value={0}>内部</Radio>
                <Radio value={1}>外部</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

/**
 * 将表单值整理为后端菜单模型需要的结构。
 *
 * @param values 表单值
 * @returns 菜单资源提交数据
 */
function normalizePayload(values: MenuPayload): MenuPayload {
  const type = values.type as MenuType;
  return {
    parentId: values.parentId ?? 0,
    name: values.name.trim(),
    type,
    url: type === 0 ? values.url?.trim() ?? '' : '',
    icon: type === 0 ? values.icon?.trim() ?? '' : '',
    perms: values.perms?.trim() ?? '',
    openStyle: values.openStyle ?? 0,
    weight: values.weight ?? 0,
  };
}

/**
 * 将菜单资源树转换为 AntD TreeSelect 数据，并禁用当前编辑节点及其子树。
 *
 * @param nodes 菜单资源树
 * @param editingId 当前编辑节点 ID
 * @param ancestorDisabled 父级是否已禁用
 * @returns TreeSelect 节点
 */
function toTreeSelectData(
  nodes: MenuResource[],
  editingId?: number,
  ancestorDisabled = false,
): TreeSelectNode[] {
  return nodes.map(node => {
    const disabled = ancestorDisabled || node.id === editingId;
    return {
      title: node.name,
      value: node.id,
      key: node.id,
      disabled,
      children: toTreeSelectData(node.children ?? [], editingId, disabled),
    };
  });
}
