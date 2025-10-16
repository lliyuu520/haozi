import React, {useEffect, useState} from 'react'
import {Form, Input, InputNumber, message, Modal, Select, TreeSelect} from 'antd'
import {createSysMenuApi, getSysMenuTreeApi, updateSysMenuApi} from '@/api/sys/menu'
import type {SysMenu, SysMenuTree} from '@/types/sys/menu'

const { Option } = Select
const { SHOW_PARENT } = TreeSelect

interface MenuFormProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  editData?: SysMenu
  parentData?: SysMenu
}

const MenuForm: React.FC<MenuFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  editData,
  parentData
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [menuTree, setMenuTree] = useState<SysMenuTree[]>([])

  // 获取菜单树
  const getMenuTree = async () => {
    try {
      const response = await getSysMenuTreeApi()
      // 确保response是数组，或者提取其中的data字段
      const treeData = Array.isArray(response) ? response : (response?.data || [])
      setMenuTree(treeData)
    } catch (error) {
      console.error('获取菜单树失败:', error)
      setMenuTree([]) // 出错时设置为空数组
    }
  }

  // 树形数据转换
  const convertToTreeData = (menus: SysMenuTree[] | any): any[] => {
    // 安全检查：确保menus是数组
    if (!Array.isArray(menus)) {
      return []
    }

    return menus.map(menu => ({
      title: menu.name,
      value: menu.id,
      key: menu.id,
      children: menu.children ? convertToTreeData(menu.children) : []
    }))
  }

  // 页面加载时获取菜单树
  useEffect(() => {
    if (visible) {
      getMenuTree()
      if (editData) {
        form.setFieldsValue(editData)
      } else if (parentData) {
        form.setFieldsValue({
          parentId: parentData.id,
          type: 1 // 默认为按钮类型
        })
      } else {
        form.setFieldsValue({
          parentId: '0',
          type: 0, // 默认为菜单类型
          status: 1,
          openStyle: 0
        })
      }
    }
  }, [visible, editData, parentData, form])

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      if (editData) {
        await updateSysMenuApi({ ...editData, ...values })
        message.success('修改成功')
      } else {
        await createSysMenuApi(values)
        message.success('新增成功')
      }

      onSuccess()
      onCancel()
    } catch (error) {
      console.error('提交失败:', error)
      message.error('操作失败')
    } finally {
      setLoading(false)
    }
  }

  // 根据菜单类型动态显示/隐藏字段
  const currentType = Form.useWatch('type', form)

  return (
    <Modal
      title={editData ? '编辑菜单' : parentData ? '新增子菜单' : '新增菜单'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 1,
          openStyle: 0
        }}
      >
        <Form.Item
          label="上级菜单"
          name="parentId"
          rules={[{ required: true, message: '请选择上级菜单' }]}
        >
          <TreeSelect
            placeholder="请选择上级菜单"
            treeData={convertToTreeData(menuTree)}
            treeDefaultExpandAll
            showCheckedStrategy={SHOW_PARENT}
            disabled={!!editData} // 编辑时不能修改上级菜单
          />
        </Form.Item>

        <Form.Item
          label="菜单名称"
          name="name"
          rules={[{ required: true, message: '请输入菜单名称' }]}
        >
          <Input placeholder="请输入菜单名称" />
        </Form.Item>

        <Form.Item
          label="菜单类型"
          name="type"
          rules={[{ required: true, message: '请选择菜单类型' }]}
        >
          <Select placeholder="请选择菜单类型" disabled={!!editData}>
            <Option value={0}>菜单</Option>
            <Option value={1}>按钮</Option>
            <Option value={2}>接口</Option>
          </Select>
        </Form.Item>

        {currentType === 0 && (
          <>
            <Form.Item
              label="路由路径"
              name="url"
              rules={[{ required: true, message: '请输入路由路径' }]}
            >
              <Input placeholder="请输入路由路径，如：/system/user" />
            </Form.Item>

            <Form.Item
              label="打开方式"
              name="openStyle"
            >
              <Select placeholder="请选择打开方式">
                <Option value={0}>内部打开</Option>
                <Option value={1}>外部打开</Option>
              </Select>
            </Form.Item>
          </>
        )}

        {(currentType === 1 || currentType === 2) && (
          <Form.Item
            label="权限标识"
            name="perms"
            rules={[{ required: true, message: '请输入权限标识' }]}
          >
            <Input placeholder="请输入权限标识，如：sys:user:add" />
          </Form.Item>
        )}

        <Form.Item
          label="排序"
          name="weight"
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber placeholder="请输入排序" min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MenuForm