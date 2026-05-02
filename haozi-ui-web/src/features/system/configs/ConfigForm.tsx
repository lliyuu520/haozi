import { Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
import { useEffect } from 'react';
import type { ConfigFile, ConfigPayload, ConfigRecord, ConfigType } from '@/features/system/configs/api';

type ConfigFormProps = {
  open: boolean;
  submitting: boolean;
  initialValues?: ConfigRecord | null;
  onCancel: () => void;
  onSubmit: (values: ConfigPayload) => void;
};

type ConfigFormValues = Omit<ConfigPayload, 'files' | 'images'> & {
  filesText?: string;
  imagesText?: string;
};

export const CONFIG_TYPE_OPTIONS: Array<{ label: string; value: ConfigType }> = [
  { label: '开关', value: 'SWITCH_TYPE' },
  { label: '文本', value: 'TEXT_TYPE' },
  { label: '数字', value: 'NUMBER_TYPE' },
  { label: '文件', value: 'FILE_TYPE' },
  { label: '图片', value: 'IMAGE_TYPE' },
];

/**
 * 参数配置新增/编辑表单。
 *
 * 不同参数类型只提交对应值，避免切换类型后把旧字段残留到缓存和后续读取逻辑中。
 */
export function ConfigForm({ open, submitting, initialValues, onCancel, onSubmit }: ConfigFormProps) {
  const [form] = Form.useForm<ConfigFormValues>();
  const selectedType = Form.useWatch('type', form) ?? initialValues?.type ?? 'TEXT_TYPE';
  const isEdit = Boolean(initialValues?.id);

  useEffect(() => {
    if (!open) {
      return;
    }
    form.setFieldsValue({
      code: initialValues?.code ?? '',
      descs: initialValues?.descs ?? '',
      type: initialValues?.type ?? 'TEXT_TYPE',
      enabled: initialValues?.enabled ?? false,
      num: initialValues?.num ?? undefined,
      text: initialValues?.text ?? '',
      filesText: stringifyFiles(initialValues?.files),
      imagesText: stringifyFiles(initialValues?.images),
    });
  }, [form, initialValues, open]);

  return (
    <Modal
      title={isEdit ? '编辑参数配置' : '新增参数配置'}
      open={open}
      confirmLoading={submitting}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={720}
      destroyOnHidden
    >
      <Form<ConfigFormValues>
        form={form}
        layout="vertical"
        onFinish={values => onSubmit(normalizePayload(values))}
      >
        <Form.Item name="code" label="参数编码" rules={[{ required: true, message: '请输入参数编码' }]}>
          <Input autoComplete="off" maxLength={128} placeholder="例如：SYSTEM_NAME" />
        </Form.Item>
        <Form.Item name="descs" label="参数描述" rules={[{ required: true, message: '请输入参数描述' }]}>
          <Input autoComplete="off" maxLength={255} placeholder="请输入参数描述" />
        </Form.Item>
        <Form.Item name="type" label="参数类型" rules={[{ required: true, message: '请选择参数类型' }]}>
          <Select options={CONFIG_TYPE_OPTIONS} placeholder="请选择参数类型" />
        </Form.Item>
        {selectedType === 'SWITCH_TYPE' && (
          <Form.Item name="enabled" label="开关状态" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>
        )}
        {selectedType === 'NUMBER_TYPE' && (
          <Form.Item name="num" label="数值" rules={[{ required: true, message: '请输入数值' }]}>
            <InputNumber precision={0} style={{ width: '100%' }} placeholder="请输入整数值" />
          </Form.Item>
        )}
        {selectedType === 'TEXT_TYPE' && (
          <Form.Item name="text" label="文本内容" rules={[{ required: true, message: '请输入文本内容' }]}>
            <Input.TextArea rows={4} maxLength={2000} showCount placeholder="请输入文本内容" />
          </Form.Item>
        )}
        {selectedType === 'FILE_TYPE' && (
          <Form.Item
            name="filesText"
            label="文件列表 JSON"
            tooltip='格式示例：[{"name":"说明文档","url":"https://example.com/file.pdf"}]'
            rules={[{ validator: validateFileJson }]}
          >
            <Input.TextArea rows={5} placeholder='[{"name":"文件名","url":"文件地址"}]' />
          </Form.Item>
        )}
        {selectedType === 'IMAGE_TYPE' && (
          <Form.Item
            name="imagesText"
            label="图片列表 JSON"
            tooltip='格式示例：[{"name":"封面","url":"https://example.com/image.png"}]'
            rules={[{ validator: validateFileJson }]}
          >
            <Input.TextArea rows={5} placeholder='[{"name":"图片名","url":"图片地址"}]' />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

/**
 * 将文件或图片列表格式化为表单可编辑的 JSON 字符串。
 *
 * @param value 文件或图片列表
 * @returns JSON 字符串
 */
function stringifyFiles(value?: ConfigFile[] | null) {
  if (!value?.length) {
    return '';
  }
  return JSON.stringify(value, null, 2);
}

/**
 * 校验文件和图片 JSON，确保提交给后端的数组元素符合 FileDTO 结构。
 */
async function validateFileJson(_: unknown, value?: string) {
  if (!value?.trim()) {
    return;
  }
  parseFileJson(value);
}

/**
 * 将表单值整理为后端 SysConfig 需要的类型互斥结构。
 *
 * @param values 表单值
 * @returns 参数配置提交数据
 */
function normalizePayload(values: ConfigFormValues): ConfigPayload {
  const payload: ConfigPayload = {
    code: values.code.trim(),
    descs: values.descs?.trim() ?? '',
    type: values.type,
  };
  if (values.type === 'SWITCH_TYPE') {
    payload.enabled = Boolean(values.enabled);
  }
  if (values.type === 'NUMBER_TYPE') {
    payload.num = values.num;
  }
  if (values.type === 'TEXT_TYPE') {
    payload.text = values.text?.trim() ?? '';
  }
  if (values.type === 'FILE_TYPE') {
    payload.files = parseFileJson(values.filesText);
  }
  if (values.type === 'IMAGE_TYPE') {
    payload.images = parseFileJson(values.imagesText);
  }
  return payload;
}

/**
 * 解析 FileDTO JSON 数组。
 *
 * @param value JSON 字符串
 * @returns 文件结构数组
 */
function parseFileJson(value?: string): ConfigFile[] {
  if (!value?.trim()) {
    return [];
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('请输入合法的 JSON 数组');
  }
  if (!Array.isArray(parsed)) {
    throw new Error('文件列表必须是数组');
  }
  parsed.forEach(item => {
    if (!item || typeof item !== 'object') {
      throw new Error('文件项必须是对象');
    }
    const file = item as Partial<ConfigFile>;
    if (!file.name || !file.url) {
      throw new Error('每个文件项必须包含 name 和 url');
    }
  });
  return parsed as ConfigFile[];
}
