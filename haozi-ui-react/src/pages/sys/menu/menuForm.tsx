import React, {useEffect, useState} from 'react'
import {AutoComplete, Form, Input, InputNumber, message, Modal, Select, TreeSelect} from 'antd'
import {createSysMenuApi, getSysMenuTreeApi, updateSysMenuApi} from '@/api/sys/menu'
import type {SysMenu, SysMenuTree} from '@/types/sys/menu'
import {COMMON_MENU_ICONS, renderAntdIcon} from '@/utils/icon'

const { Option } = Select
const { SHOW_PARENT } = TreeSelect
const ICON_SUGGESTIONS = COMMON_MENU_ICONS.map(icon => ({ value: icon }))

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
      const treeData = Array.isArray(response) ? response : (response?.data || [])
      setMenuTree(treeData)
    } catch (error) {
      console.error('获取菜单树失败:', error)
      setMenuTree([])
    }
  }

  // 数据转换
  const convertToTreeData = (menus: SysMenuTree[] | any): any[] => {
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

  // 页面打开时获取菜单树
  useEffect(() => {
    if (visible) {
      getMenuTree()
      if (editData) {
        form.setFieldsValue(editData)
      } else if (parentData) {
        form.setFieldsValue({
          parentId: parentData.id,
          type: 1,
        })
      } else {
        form.setFieldsValue({
          parentId: '0',
          type: 0,
          status: 1,
          openStyle: 0,
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
        message.success('创建成功')
      }

      onSuccess()
      onCancel()
    } catch (error) {
      console.error('提交失败:', error)
      message.error('提交失败')
    } finally {
      setLoading(false)
    }
  }

  // 监听表单字段
  const currentType = Form.useWatch('type', form)
  const iconValue = Form.useWatch('icon', form)

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
          openStyle: 0,
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
            disabled={!!editData}
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
              label="图标"
              name="icon"
            >
              <AutoComplete
                options={ICON_SUGGESTIONS}
                placeholder="请输入图标名称，例如 DashboardOutlined"
                allowClear
                filterOption={(inputValue, option) =>
                  (option?.value ?? '').toLowerCase().includes(inputValue.toLowerCase())
                }
              >
                <Input suffix={renderAntdIcon(iconValue) ?? undefined} />
              </AutoComplete>
            </Form.Item>

            <Form.Item
              label="路由地址"
              name="url"
            >
              <Input placeholder="请输入路由地址，例如 sys/user/index" />
            </Form.Item>

            <Form.Item
              label="打开方式"
              name="openStyle"
            >
              <Select placeholder="请选择打开方式">
                <Option value={0}>内部</Option>
                <Option value={1}>外部</Option>
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
            <Input placeholder="请输入权限标识，例如 sys:user:add" />
          </Form.Item>
        )}

        <Form.Item
          label="排序"
          name="weight"
          rules={[{ required: true, message: '请输入排序值' }]}
        >
          <InputNumber placeholder="请输入排序值" min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MenuForm
