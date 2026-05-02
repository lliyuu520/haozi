import { Form, Input, InputNumber, Modal } from 'antd';
import { useEffect } from 'react';
import type { DictDataPayload, DictDataRecord, DictTypeRecord } from '@/features/system/dicts/api';

type DictDataFormProps = {
  open: boolean;
  submitting: boolean;
  dictType: DictTypeRecord | null;
  initialValues?: DictDataRecord | null;
  onCancel: () => void;
  onSubmit: (values: DictDataPayload) => void;
};

/**
 * 字典数据新增/编辑表单。
 *
 * 字典数据始终归属于当前选中的字典类型，表单不允许手工改动 dictType，
 * 避免右侧列表保存后跳到其他类型造成数据流混乱。
 */
export function DictDataForm({
  open,
  submitting,
  dictType,
  initialValues,
  onCancel,
  onSubmit,
}: DictDataFormProps) {
  const [form] = Form.useForm<DictDataPayload>();
  const isEdit = Boolean(initialValues?.id);

  useEffect(() => {
    if (!open) {
      return;
    }
    form.setFieldsValue({
      dictType: dictType?.dictType ?? initialValues?.dictType ?? '',
      dictLabel: initialValues?.dictLabel ?? '',
      dictValue: initialValues?.dictValue ?? '',
      weight: initialValues?.weight ?? 0,
      remark: initialValues?.remark ?? '',
    });
  }, [dictType, form, initialValues, open]);

  return (
    <Modal
      title={isEdit ? '编辑字典数据' : `新增「${dictType?.dictName ?? '字典'}」数据`}
      open={open}
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form<DictDataPayload> form={form} layout="vertical" onFinish={values => onSubmit(normalizePayload(values))}>
        <Form.Item name="dictType" label="字典类型">
          <Input disabled />
        </Form.Item>
        <Form.Item name="dictLabel" label="字典标签" rules={[{ required: true, message: '请输入字典标签' }]}>
          <Input autoComplete="off" maxLength={100} placeholder="例如：男" />
        </Form.Item>
        <Form.Item name="dictValue" label="字典值" rules={[{ required: true, message: '请输入字典值' }]}>
          <Input autoComplete="off" maxLength={100} placeholder="例如：1" />
        </Form.Item>
        <Form.Item name="weight" label="排序" rules={[{ required: true, message: '请输入排序' }]}>
          <InputNumber min={0} precision={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea maxLength={200} rows={3} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
}

/**
 * 整理字典数据表单提交数据。
 *
 * @param values 表单值
 * @returns 字典数据提交数据
 */
function normalizePayload(values: DictDataPayload): DictDataPayload {
  return {
    dictType: values.dictType,
    dictLabel: values.dictLabel.trim(),
    dictValue: values.dictValue.trim(),
    weight: values.weight ?? 0,
    remark: values.remark?.trim() || undefined,
  };
}
