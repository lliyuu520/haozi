import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import type { RoleOption, UserPayload, UserRecord } from '@/features/system/users/api';

type UserFormProps = {
  open: boolean;
  submitting: boolean;
  roleOptions: RoleOption[];
  initialValues?: UserRecord | null;
  onCancel: () => void;
  onSubmit: (values: UserPayload) => void;
};

/**
 * 用户新增/编辑表单。
 *
 * 新增时密码必填；编辑时密码留空表示不修改密码，后端不会覆盖原密码。
 */
export function UserForm({
  open,
  submitting,
  roleOptions,
  initialValues,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const [form] = Form.useForm<UserPayload>();
  const isEdit = Boolean(initialValues?.id);

  useEffect(() => {
    if (!open) {
      return;
    }
    form.setFieldsValue({
      username: initialValues?.username ?? '',
      password: '',
      roleIdList: initialValues?.roleIdList ?? [],
    });
  }, [form, initialValues, open]);

  return (
    <Modal
      title={isEdit ? '编辑用户' : '新增用户'}
      open={open}
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form<UserPayload> form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input autoComplete="off" maxLength={64} />
        </Form.Item>
        <Form.Item
          name="password"
          label={isEdit ? '新密码' : '密码'}
          rules={isEdit ? [] : [{ required: true, message: '请输入密码' }]}
          extra={isEdit ? '留空表示不修改密码' : undefined}
        >
          <Input.Password autoComplete="new-password" maxLength={64} />
        </Form.Item>
        <Form.Item name="roleIdList" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
          <Select
            mode="multiple"
            placeholder="请选择角色"
            options={roleOptions.map(role => ({ label: role.name, value: role.id }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
