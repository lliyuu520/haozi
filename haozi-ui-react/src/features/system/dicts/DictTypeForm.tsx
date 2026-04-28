import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import type { DictTypePayload, DictTypeRecord } from '@/features/system/dicts/api';

type DictTypeFormProps = {
  open: boolean;
  submitting: boolean;
  initialValues?: DictTypeRecord | null;
  onCancel: () => void;
  onSubmit: (values: DictTypePayload) => void;
};

/**
 * 字典类型新增/编辑表单。
 *
 * 字典类型编码是字典数据归属和前端缓存刷新依赖的稳定键，编辑时允许修改，
 * 但保存后需要刷新左侧类型列表和右侧当前数据。
 */
export function DictTypeForm({
  open,
  submitting,
  initialValues,
  onCancel,
  onSubmit,
}: DictTypeFormProps) {
  const [form] = Form.useForm<DictTypePayload>();
  const isEdit = Boolean(initialValues?.id);

  useEffect(() => {
    if (!open) {
      return;
    }
    form.setFieldsValue({
      dictType: initialValues?.dictType ?? '',
      dictName: initialValues?.dictName ?? '',
      remark: initialValues?.remark ?? '',
    });
  }, [form, initialValues, open]);

  return (
    <Modal
      title={isEdit ? '编辑字典类型' : '新增字典类型'}
      open={open}
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form<DictTypePayload> form={form} layout="vertical" onFinish={values => onSubmit(normalizePayload(values))}>
        <Form.Item name="dictType" label="字典类型" rules={[{ required: true, message: '请输入字典类型' }]}>
          <Input autoComplete="off" maxLength={100} placeholder="例如：sys_gender" />
        </Form.Item>
        <Form.Item name="dictName" label="字典名称" rules={[{ required: true, message: '请输入字典名称' }]}>
          <Input autoComplete="off" maxLength={100} placeholder="例如：性别" />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea maxLength={200} rows={3} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
}

/**
 * 整理字典类型表单提交数据。
 *
 * @param values 表单值
 * @returns 字典类型提交数据
 */
function normalizePayload(values: DictTypePayload): DictTypePayload {
  return {
    dictType: values.dictType.trim(),
    dictName: values.dictName.trim(),
    remark: values.remark?.trim() || undefined,
  };
}
