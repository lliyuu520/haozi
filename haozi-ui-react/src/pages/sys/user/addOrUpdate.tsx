import React, {useEffect, useState} from 'react'
import {Form, Input, message, Modal, Checkbox, Button} from 'antd'
import type {SysRole} from '@/types/sys/role'
import {createSysUserApi, getSysUserInfoApi, updateSysUserApi} from '@/api/sys/user.ts'
import {getSysRoleListApi} from "@/api/sys/role";


interface UserFormProps {
  visible: boolean
  id?: number | undefined
  onSuccess?: () => void
  onCancel: () => void
  isView?: boolean
}

const UserForm: React.FC<UserFormProps> = ({ visible, id, onSuccess, onCancel, isView = false }) => {
  const [form] = Form.useForm()
  const [checkedKeys, setCheckedKeys] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [roleList, setRoleList] = useState<SysRole[]>([])

  useEffect(() => {
    if (visible) {
        // 加载角色多选框
      loadRoles()
      if (id) {
          // 加载用户信息
        loadUserInfo(id)
      } else {
        form.resetFields()
        form.setFieldsValue({ status: 1 })
        setCheckedKeys([])
      }
    }
  }, [visible, id, form])

    const loadUserInfo = async (id:number) => {
      try {
        const response = await getSysUserInfoApi(id)
        if (response.data) {
          const userData = response.data
          form.setFieldsValue({
            username: userData.username,
          })
          setCheckedKeys(userData.roleIdList || [])
        }
      } catch (error) {
        console.error('加载用户信息失败:', error)
        message.error('加载用户信息失败')
      }
    }
    const loadRoles = async () => {
      try {
        const response = await getSysRoleListApi()
        setRoleList(response.data || response)
      } catch (error) {
        console.error('加载角色列表失败:', error)
        message.error('加载角色列表失败')
      }
    }



  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // 编辑时，如果没有输入密码，则不提交密码字段
      if (id && !values.password) {
        delete values.password
      }

      const userData = {
        id,
        ...values,
        roleIdList: checkedKeys
      }

      if (id) {
        await updateSysUserApi(userData)
        message.success('修改成功')
      } else {
        await createSysUserApi(userData)
        message.success('新增成功')
      }

      onSuccess?.()
    } catch (error) {
      console.error('保存用户失败:', error)
      message.error('保存用户失败')
    } finally {
      setLoading(false)
    }
  }


  return (
    <Modal
      title={isView ? '用户详情' : (id ? '编辑用户' : '新增用户')}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
      footer={isView ? [
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ] : undefined}
    >
      <Form form={form} layout="vertical" initialValues={{ status: 1 }}>
        <Form.Item
          label="用户账号"
          name="username"
          rules={[
            { required: true, message: '请输入用户账号' },
            { min: 3, max: 20, message: '用户账号长度为3-20个字符' }
          ]}
        >
          <Input placeholder="请输入用户账号" disabled={isView} />
        </Form.Item>

        {!isView && (
          <Form.Item
            label="用户密码"
            name="password"
            rules={id ? [] : [{ required: true, message: '请输入用户密码' }]}
          >
            <Input.Password placeholder={id ? "留空则不修改密码" : "请输入用户密码"} />
          </Form.Item>
        )}

        <Form.Item
          label="角色"
          required
        >
          <Checkbox.Group
            value={checkedKeys}
            onChange={setCheckedKeys}
            disabled={isView}
            style={{ width: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {roleList.map(role => (
                <Checkbox key={role.id} value={role.id}>
                  {role.name}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserForm