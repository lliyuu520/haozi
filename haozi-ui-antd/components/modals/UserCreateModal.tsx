'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Spin,
} from 'antd';
import type { UserFormValues } from '@/app/(system)/system/user/page';
import { createUser, type UserCreateParams } from '@/services/user';
import { getRoleList, type RoleVO } from '@/services/role';

interface UserCreateModalProps {
  onClose: () => void;
}

export default function UserCreateModal({ onClose }: UserCreateModalProps) {
  const [form] = Form.useForm<UserFormValues>();
  const [saving, setSaving] = useState(false);
  const [roleOptions, setRoleOptions] = useState<RoleVO[]>([]);

  // 加载角色列表
  const loadRoles = useCallback(async () => {
    try {
      const response = await getRoleList();
      setRoleOptions(response.data?.data ?? []);
    } catch (error) {
      console.error(error);
      message.error('加载角色列表失败，请稍后重试');
    }
  }, []);

  useEffect(() => {
    void loadRoles();
    form.resetFields();
    form.setFieldsValue({ status: 0 });
  }, [form, loadRoles]);

  // 提交表单
  const handleSubmit = async (values: UserFormValues) => {
    if (!values.password) {
      message.error('请输入密码');
      return;
    }

    const roleIdList = values.roleId ? [values.roleId] : [];
    const params: UserCreateParams = {
      username: values.username,
      password: values.password,
      nickname: values.nickname,
      email: values.email,
      phone: values.phone,
      status: values.status ?? 0,
      roleIdList,
      avatar: undefined,
    };

    setSaving(true);
    try {
      await createUser(params);
      message.success('创建成功');
      onClose();
    } catch (error) {
      console.error(error);
      message.error('创建失败，请稍后再试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Spin spinning={false}>
      <Form<UserFormValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: 0 }}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          name="nickname"
          label="昵称"
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input placeholder="请输入昵称" />
        </Form.Item>

        <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '请输入有效邮箱' }]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item name="phone" label="手机号">
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item
          name="roleId"
          label="角色"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select placeholder="请选择角色" loading={roleOptions.length === 0}>
            {roleOptions.map(role => (
              <Select.Option key={role.id} value={role.id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="status" label="状态">
          <Select>
            <Select.Option value={0}>启用</Select.Option>
            <Select.Option value={1}>禁用</Select.Option>
            <Select.Option value={2}>锁定</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" loading={saving} onClick={() => form.submit()}>
              创建
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  );
}