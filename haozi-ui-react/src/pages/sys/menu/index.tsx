import React, {useEffect, useState} from 'react'
import {Button, Card, Form, Input, Modal, Select, Space, Table, Tag} from 'antd'
import {PlusCircleOutlined, PlusOutlined, RedoOutlined, SearchOutlined, UserOutlined} from '@ant-design/icons'
import type {ColumnsType} from 'antd/es/table'
import {useCrud} from '@/hooks/useCrud'
import {useUserStore} from '@/stores'
import type {SysMenu} from '@/types/sys/menu'
import MenuForm from './menuForm.tsx'
import {renderAntdIcon} from '@/utils/icon'

const { Option } = Select

const MenuManagement: React.FC = () => {
  const [form] = Form.useForm()
  const { hasPermission } = useUserStore()

  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [addSubModalVisible, setAddSubModalVisible] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<SysMenu | null>(null)

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
    isPage: false,
  })

  useEffect(() => {
    getDataList()
  }, [])

  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除当前菜单吗？',
      onOk: () => deleteHandle(id),
    })
  }

  const renderMenuType = (type: number) => {
    const typeMap: Record<number, { text: string; color: string }> = {
      0: { text: '菜单', color: 'green' },
      1: { text: '按钮', color: 'orange' },
      2: { text: '接口', color: 'blue' },
    }
    const config = typeMap[type] || { text: '未知', color: 'default' }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const renderRoutePath = (record: SysMenu) => {
    if (record.type === 1 || record.type === 2) {
      return '-'
    }
    return record.url || '-'
  }

  const columns: ColumnsType<SysMenu> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (text: string, record: SysMenu) => {
        const indent = record.parentId && record.parentId !== '0' ? 20 : 0
        const iconNode = renderAntdIcon(record.icon)
        return (
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: indent }}>
            {iconNode && <span style={{ marginRight: 8 }}>{iconNode}</span>}
            {!iconNode && record.icon && <span style={{ marginRight: 8 }}>{record.icon}</span>}
            <span>{text}</span>
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
      width: 180,
      render: (perms: string) => perms || '-',
    },
    {
      title: '路由地址',
      key: 'path',
      width: 180,
      render: (_, record) => renderRoutePath(record),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: renderMenuType,
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {hasPermission('sys:menu:info') && (
            <Button
              type="link"
              size="small"
              icon={<UserOutlined />}
              onClick={() => {
                setSelectedMenu(record)
                setViewModalVisible(true)
              }}
            >
              查看
            </Button>
          )}
          {hasPermission('sys:menu:update') && (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedMenu(record)
                setEditModalVisible(true)
              }}
            >
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

  const handleCreate = () => {
    setCreateModalVisible(true)
  }

  const closeModal = (modalSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    modalSetter(false)
    setSelectedMenu(null)
  }

  const handleFormSuccess = () => {
    getDataList()
  }

  return (
    <Card>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="name">
          <Input placeholder="菜单名称" allowClear style={{ width: 160 }} />
        </Form.Item>
        <Form.Item name="type">
          <Select placeholder="菜单类型" allowClear style={{ width: 140 }}>
            <Option value={0}>菜单</Option>
            <Option value={1}>按钮</Option>
            <Option value={2}>接口</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status">
          <Select placeholder="状态" allowClear style={{ width: 140 }}>
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

      <MenuForm
        visible={createModalVisible}
        onCancel={() => closeModal(setCreateModalVisible)}
        onSuccess={handleFormSuccess}
      />

      <MenuForm
        visible={editModalVisible}
        onCancel={() => closeModal(setEditModalVisible)}
        onSuccess={handleFormSuccess}
        {...(editModalVisible && selectedMenu ? { editData: selectedMenu } : {})}
      />

      <MenuForm
        visible={addSubModalVisible}
        onCancel={() => closeModal(setAddSubModalVisible)}
        onSuccess={handleFormSuccess}
        {...(addSubModalVisible && selectedMenu ? { parentData: selectedMenu } : {})}
      />

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

const MenuDetail: React.FC<{ menu: SysMenu }> = ({ menu }) => {
  const iconNode = renderAntdIcon(menu.icon)
  const hasIcon = !!iconNode || !!menu.icon
  return (
    <div>
      <Card title="基础信息" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><strong>菜单名称:</strong> {menu.name}</div>
          <div><strong>菜单类型:</strong> {menu.type === 0 ? '菜单' : menu.type === 1 ? '按钮' : '接口'}</div>
          <div>
            <strong>图标:</strong>{' '}
            {hasIcon ? (
              <>
                {iconNode}
                {menu.icon && <span style={{ marginLeft: iconNode ? 8 : 0 }}>{menu.icon}</span>}
              </>
            ) : (
              '无'
            )}
          </div>
          <div><strong>排序:</strong> {menu.weight}</div>
          <div><strong>权限标识:</strong> {menu.perms || '无'}</div>
        </div>
      </Card>

      {menu.type === 0 && (
        <Card title="路由信息" style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><strong>路由地址:</strong> {menu.url || '无'}</div>
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
}

export default MenuManagement
