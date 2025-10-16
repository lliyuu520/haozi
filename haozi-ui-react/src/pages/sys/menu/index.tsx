import React, {useEffect, useState} from 'react'
import {Button, Card, Form, Input, Modal, Select, Space, Table, Tag} from 'antd'
import {PlusCircleOutlined, PlusOutlined, RedoOutlined, SearchOutlined, UserOutlined} from '@ant-design/icons'
import {useCrud} from '@/hooks/useCrud'
import {useUserStore} from '@/stores'
import type {SysMenu} from '@/types/sys/menu'
import type {ColumnsType} from 'antd/es/table'
import MenuForm from './MenuForm'

const { Option } = Select

const MenuManagement: React.FC = () => {
  const [form] = Form.useForm()
  const { hasPermission } = useUserStore()

  // 弹窗状态管理
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [addSubModalVisible, setAddSubModalVisible] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<SysMenu | null>(null)

  // 使用useCrud hook
  const {
    state,
    getDataList,
    resetQueryForm,
    currentChangeHandle,
    sizeChangeHandle,
    deleteHandle,
  } = useCrud({
    dataListUrl: '/sys/menu/list',
    deleteUrl: '/sys/menu',
    queryForm: {
      name: '',
      type: undefined,
      status: undefined,
    },
    isPage: false, // 菜单列表不分页
  })


  // 页面加载时获取菜单数据
  useEffect(() => {
    getDataList()
  }, [])

  // 确认删除
  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      onOk: () => deleteHandle(id),
    })
  }

  // 渲染菜单类型标签
  const renderMenuType = (type: number) => {
    const typeMap = {
      0: { text: '菜单', color: 'green' },
      1: { text: '按钮', color: 'orange' },
      2: { text: '接口', color: 'blue' }
    }
    const config = typeMap[type as keyof typeof typeMap] || { text: '未知', color: 'default' }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  // 渲染路由路径
  const renderRoutePath = (record: SysMenu) => {
    if (record.type === 1 || record.type === 2) return '-'
    return record.url || '-'
  }

 
  // 表格列定义
  const columns: ColumnsType<SysMenu> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: SysMenu) => {
        const indent = record.parentId !== '0' && record.parentId ? 20 : 0
        return (
          <div style={{ paddingLeft: indent }}>
            {record.icon && <span style={{ marginRight: 8 }}>{record.icon}</span>}
            {text}
          </div>
        )
      },
    },
    {
      title: '排序',
      dataIndex: 'weight',
      key: 'weight',
      width: 80,
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      key: 'perms',
      width: 150,
      render: (perms: string) => perms || '-',
    },
    {
      title: '路由路径',
      key: 'path',
      width: 150,
      render: (_, record) => renderRoutePath(record),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: renderMenuType,
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="small">
          {hasPermission('sys:menu:info') && (
            <Button type="link" size="small" icon={<UserOutlined />} onClick={() => {
              setSelectedMenu(record)
              setViewModalVisible(true)
            }}>
              查看
            </Button>
          )}
          {hasPermission('sys:menu:update') && (
            <Button type="link" size="small" onClick={() => {
              setSelectedMenu(record)
              setEditModalVisible(true)
            }}>
              修改
            </Button>
          )}
          {record.type === 0 && hasPermission('sys:menu:save') && (
            <Button
              type="link"
              size="small"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setSelectedMenu(record)
                setAddSubModalVisible(true)
              }}
            >
              新增子菜单
            </Button>
          )}
          {/* 状态修改功能暂无后端接口 */}
          {hasPermission('sys:menu:delete') && (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => confirmDelete(record.id)}
            >
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ]


  // 处理新增
  const handleCreate = () => {
    setCreateModalVisible(true)
  }

  // 关闭弹窗并重置状态
  const closeModal = (modalSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    modalSetter(false)
    setSelectedMenu(null)
  }

  // 表单提交成功回调
  const handleFormSuccess = () => {
    getDataList()
  }

  // 树形数据转换
  const convertToTreeData = (menus: any[]): any[] => {
    return menus.map(menu => ({
      title: menu.name,
      value: menu.id,
      key: menu.id,
      children: menu.children ? convertToTreeData(menu.children) : []
    }))
  }

  return (
    <Card>
      {/* 搜索表单 */}
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="name">
          <Input placeholder="菜单名称" allowClear style={{ width: 150 }} />
        </Form.Item>
        <Form.Item name="type">
          <Select placeholder="菜单类型" allowClear style={{ width: 120 }}>
            <Option value={0}>菜单</Option>
            <Option value={1}>按钮</Option>
            <Option value={2}>接口</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status">
          <Select placeholder="状态" allowClear style={{ width: 120 }}>
            <Option value={1}>启用</Option>
            <Option value={0}>禁用</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                state.queryForm = form.getFieldsValue()
                state.page = 1
                getDataList()
              }}
            >
              查询
            </Button>
            <Button icon={<RedoOutlined />} onClick={resetQueryForm}>
              重置
            </Button>
            {hasPermission('sys:menu:save') && (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                新增
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={state.dataList}
        rowKey="id"
        loading={state.loading}
        pagination={{
          current: state.page,
          pageSize: state.limit,
          total: state.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条记录`,
          pageSizeOptions: state.pageSizes,
          onChange: currentChangeHandle,
          onShowSizeChange: sizeChangeHandle,
        }}
        scroll={{ x: 1500 }}
        bordered
      />

      {/* 新增菜单弹窗 */}
      <MenuForm
        visible={createModalVisible}
        onCancel={() => closeModal(setCreateModalVisible)}
        onSuccess={handleFormSuccess}
      />

      {/* 编辑菜单弹窗 */}
      {selectedMenu ? (
        <MenuForm
          visible={editModalVisible}
          onCancel={() => closeModal(setEditModalVisible)}
          onSuccess={handleFormSuccess}
          editData={selectedMenu}
        />
      ) : (
        <MenuForm
          visible={editModalVisible}
          onCancel={() => closeModal(setEditModalVisible)}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* 新增子菜单弹窗 */}
      {selectedMenu ? (
        <MenuForm
          visible={addSubModalVisible}
          onCancel={() => closeModal(setAddSubModalVisible)}
          onSuccess={handleFormSuccess}
          parentData={selectedMenu}
        />
      ) : (
        <MenuForm
          visible={addSubModalVisible}
          onCancel={() => closeModal(setAddSubModalVisible)}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* 查看菜单弹窗 */}
      <Modal
        title="菜单详情"
        open={viewModalVisible}
        onCancel={() => closeModal(setViewModalVisible)}
        footer={[
          <Button key="close" onClick={() => closeModal(setViewModalVisible)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedMenu && <MenuDetail menu={selectedMenu} />}
      </Modal>
    </Card>
  )
}

// 菜单详情组件
const MenuDetail: React.FC<{ menu: SysMenu }> = ({ menu }) => (
  <div>
    <Card title="基本信息" style={{ marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><strong>菜单名称:</strong> {menu.name}</div>
        <div><strong>菜单类型:</strong> {menu.type === 0 ? '菜单' : menu.type === 1 ? '按钮' : '接口'}</div>
        <div><strong>排序:</strong> {menu.weight}</div>
        <div><strong>权限标识:</strong> {menu.perms || '无'}</div>
      </div>
    </Card>

    {menu.type === 0 && (
      <Card title="路由信息" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><strong>路由路径:</strong> {menu.url || '无'}</div>
          <div><strong>打开方式:</strong> {menu.openStyle === 1 ? '外部' : '内部'}</div>
        </div>
      </Card>
    )}
    {(menu.type === 1 || menu.type === 2) && (
      <Card title="权限信息" style={{ marginBottom: 16 }}>
        <div><strong>权限标识:</strong> {menu.perms || '无'}</div>
      </Card>
    )}

    <Card title="时间信息">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><strong>创建时间:</strong> {menu.createTime}</div>
        <div><strong>更新时间:</strong> {menu.updateTime}</div>
      </div>
    </Card>
  </div>
)

export default MenuManagement