import React, {useEffect, useState} from 'react'
import {Form, Input, InputNumber, message, Modal, Radio, Tree} from 'antd'
import type {SysMenu} from '@/types/sys/role'
import {createSysRoleApi, getSysMenuTreeApi, getSysRoleInfoApi, updateSysRoleApi} from '@/api/sys/role'

const { TextArea } = Input

interface RoleFormProps {
  visible: boolean
  id?: number | undefined
  onSuccess: () => void
  onCancel: () => void
}

const RoleForm: React.FC<RoleFormProps> = ({ visible, id, onSuccess, onCancel }) => {
  const [form] = Form.useForm()
  const [menuTree, setMenuTree] = useState<SysMenu[]>([])
  const [checkedKeys, setCheckedKeys] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      loadMenuTree()
      if (id) {
        loadRoleInfo()
      } else {
        form.resetFields()
        setCheckedKeys([])
      }
    }
  }, [visible, id])

  const loadMenuTree = async () => {
    try {
      const response = await getSysMenuTreeApi()
      setMenuTree(response.data || response)
    } catch (error) {
      console.error('加载菜单树失败:', error)
      message.error('加载菜单树失败')
    }
  }

  const loadRoleInfo = async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await getSysRoleInfoApi(id)
      const roleData = response.data || response
      form.setFieldsValue(roleData)
      setCheckedKeys(roleData.menuIdList || [])
    } catch (error) {
      console.error('加载角色信息失败:', error)
      message.error('加载角色信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const roleData = {
        ...values,
        menuIdList: checkedKeys
      }

      if (id) {
        await updateSysRoleApi(roleData)
        message.success('修改成功')
      } else {
        await createSysRoleApi(roleData)
        message.success('新增成功')
      }

      onSuccess()
    } catch (error) {
      console.error('保存角色失败:', error)
      message.error('保存角色失败')
    } finally {
      setLoading(false)
    }
  }

  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue)
  }

  return (
    <Modal
      title={id ? '编辑角色' : '新增角色'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="角色名称"
          name="name"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>

        <Form.Item
          label="角色编码"
          name="code"
          rules={[{ required: true, message: '请输入角色编码' }]}
        >
          <Input placeholder="请输入角色编码" />
        </Form.Item>

        <Form.Item
          label="排序"
          name="sort"
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber min={0} placeholder="请输入排序" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
        >
          <TextArea placeholder="请输入备注" rows={3} />
        </Form.Item>

        <Form.Item label="菜单权限">
          <Tree
            checkable
            checkedKeys={checkedKeys}
            onCheck={onCheck}
            treeData={menuTree}
            fieldNames={{ title: 'name', key: 'id', children: 'children' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RoleForm