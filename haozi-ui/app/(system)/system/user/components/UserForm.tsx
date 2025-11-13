'use client';

import {useCallback, useEffect, useState} from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  Select,
  Radio,
  Card,
  message,
  Tooltip,
} from 'antd';
import {
  InfoCircleOutlined,
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import {
  getUserDetail,
  createUser,
  updateUser,
  getRoleListForUser,
} from '@/services/userService';
import { useMenuStore } from '@/stores/menuStore';
import {
  type UserFormValues,
  type UserUpdateParams,
  type UserCreateParams,
  type RoleOption,
} from '@/types/user';

const DEFAULT_FORM_VALUES: UserFormValues = {
  username: '',
  password: '',
  enabled: true,
  roleIdList: [],
};

interface UserFormProps {
  mode: 'create' | 'edit' | 'view';
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
  defaultValues?: Partial<UserFormValues>;
}

export default function UserForm({
  mode,
  userId,
  onSuccess,
  onCancel,
  defaultValues,
}: UserFormProps) {
  const [form] = Form.useForm<UserFormValues>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const { refreshAuthority } = useMenuStore();

  const isReadOnly = mode === 'view';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  // 加载表单数据
  const loadFormData = useCallback(async () => {
    if ((isEdit || isReadOnly) && userId) {
      try {
        const userDetail = await getUserDetail(userId);
        if (userDetail) {
          const formValues: UserFormValues = {
            username: userDetail.username,
            enabled: userDetail.enabled,
            roleIdList: userDetail.roleIdList || [],
          };

          form.setFieldsValue(formValues);
        }
      } catch (error) {
        message.error('加载用户信息失败');
      }
    } else if (isCreate) {
      const mergedValues = {...DEFAULT_FORM_VALUES, ...defaultValues};
      form.setFieldsValue(mergedValues);
    }

    setInitialLoading(false);
  }, [userId, isEdit, isReadOnly, isCreate, defaultValues, form]);

  // 加载角色列表
  const loadOptions = useCallback(async () => {
    try {
      const roleData = await getRoleListForUser();
      setRoleOptions(roleData);
    } catch (error) {
      message.error('加载角色数据失败');
    }
  }, []);

  useEffect(() => {
    loadFormData();
    loadOptions();
  }, [loadFormData, loadOptions]);

  // 提交表单
  const handleSubmit = async () => {
    if (isReadOnly) return;

    try {
      setLoading(true);
      const values = await form.validateFields();

      if (isCreate) {
        const createParams: UserCreateParams = {
          ...values,
        };
        await createUser(createParams);
        message.success('创建用户成功');
      } else if (isEdit && userId) {
        const updateParams: UserUpdateParams = {
          ...values,
          id: userId,
        };
        await updateUser(updateParams);
        message.success('更新用户成功');
      }

      // 刷新用户权限和菜单
      try {
        await refreshAuthority();
        console.log('用户权限已刷新');
      } catch (error) {
        console.error('刷新权限失败:', error);
        // 权限刷新失败不影响用户操作成功
      }

      onSuccess();
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error(isCreate ? '创建用户失败' : '更新用户失败');
    } finally {
      setLoading(false);
    }
  };

  
  if (initialLoading) {
    return <div className="flex justify-center items-center h-64">加载中...</div>;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={DEFAULT_FORM_VALUES}
      disabled={isReadOnly}
      className="w-full"
    >
      <Card title="基本信息" className="mb-4">
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: !isReadOnly, message: '请输入用户名' },
            { min: 3, max: 50, message: '用户名长度应在3-50个字符之间' },
          ]}
          tooltip="用于系统登录的唯一标识"
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名"
            readOnly={isReadOnly}
          />
        </Form.Item>

        {isCreate && (
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: isCreate, message: '请输入密码' },
              { min: 6, max: 20, message: '密码长度应在6-20个字符之间' },
            ]}
            tooltip="密码长度6-20位"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              readOnly={isReadOnly}
            />
          </Form.Item>
        )}

        <Form.Item
          name="enabled"
          label="用户状态"
          rules={[{ required: !isReadOnly, message: '请选择用户状态' }]}
        >
          <Radio.Group disabled={isReadOnly}>
            <Radio value={true}>
              <span className="text-green-600">启用</span>
            </Radio>
            <Radio value={false}>
              <span className="text-red-600">禁用</span>
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="roleIdList" label="用户角色">
          <Select
            mode="multiple"
            placeholder="请选择用户角色"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.title ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={roleOptions}
            readOnly={isReadOnly}
          />
        </Form.Item>
      </Card>

      {!isReadOnly && (
        <div className="flex justify-end space-x-4">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {isCreate ? '创建' : '保存'}
          </Button>
        </div>
      )}
    </Form>
  );
}