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
import { getUserDetail, updateUser, type UserUpdateParams } from '@/services/user';
import { getRoleList, type RoleVO } from '@/services/role';

// 用户表单数据类型
interface UserFormValues {
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  password?: string;
  roleId?: string;
  status?: number;
}

interface UserEditModalProps {
  userId: string;          // 改为字符串类型，避免精度丢失
  onClose: () => void;
}

export default function UserEditModal({ userId, onClose }: UserEditModalProps) {
  const [form] = Form.useForm<UserFormValues>();
  const [saving, setSaving] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
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

  // 加载用户详情
  const loadUserDetail = useCallback(async () => {
    setDetailLoading(true);
    try {
      const response = await getUserDetail(userId);
      const detail = response.data?.data;
      if (!detail) {
        throw new Error('用户详情为空');
      }

      form.setFieldsValue({
        username: detail.username,
        nickname: detail.nickname,
        email: detail.email,
        phone: detail.phone,
        status: detail.status ?? 0,
        roleId: detail.roleIdList?.[0],
      });
    } catch (error) {
      console.error(error);
      message.error('获取用户详情失败，请稍后再试');
      onClose();
    } finally {
      setDetailLoading(false);
    }
  }, [userId, form, onClose]);

  useEffect(() => {
    void loadRoles();
    void loadUserDetail();
  }, [loadRoles, loadUserDetail]);

  // 提交表单
  const handleSubmit = async (values: UserFormValues) => {
    const roleIdList = values.roleId ? [values.roleId] : [];
    const params: UserUpdateParams = {
      id: userId,
      username: values.username,
      nickname: values.nickname,
      email: values.email,
      phone: values.phone,
      status: values.status ?? 0,
      roleIdList,
      avatar: undefined,
    };

    if (values.password) {
      params.password = values.password;
    }

    setSaving(true);
    try {
      await updateUser(params);
      message.success('更新成功');
      onClose();
    } catch (error) {
      console.error(error);
      message.error('更新失败，请稍后再试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Spin spinning={detailLoading}>
      <Form<UserFormValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" disabled />
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

        <Form.Item name="password" label="密码">
          <Input.Password placeholder="留空表示不修改密码" />
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
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  );
}