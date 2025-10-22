import React, {useState} from 'react'
import {Button, Card, Form, Input, message, Modal, Space, Table} from 'antd'
import {KeyOutlined, PlusOutlined, RedoOutlined, SearchOutlined, UserOutlined, EditOutlined} from '@ant-design/icons'
import {useCrud} from '@/hooks/useCrud'
import {useUserStore} from '@/stores'
import {resetSysUserPasswordApi} from '@/api/sys/user'
import type {SysUser} from '@/types/sys/user'
import type {ColumnsType} from 'antd/es/table'
import UserForm from './addOrUpdate'


const UserManagement: React.FC = () => {
  const [form] = Form.useForm()
  const { hasPermission } = useUserStore()

  // 弹窗状态管理
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SysUser | null>(null)

  // 使用useCrud hook
  const {
    state,
    getDataList,
    resetQueryForm,
    currentChangeHandle,
    sizeChangeHandle,
    deleteHandle,
  } = useCrud({
    dataListUrl: '/sys/user/page',
    deleteUrl: '/sys/user',
    queryForm: {
      username: ''
    },
  })



  
  // 重置密码
  const resetPassword = async (record: SysUser) => {
    Modal.confirm({
      title: '确认重置密码',
      content: `确定要重置用户 "${record.username}" 的密码吗？重置后密码为：123456`,
      onOk: async () => {
        try {
          await resetSysUserPasswordApi(record.id)
          message.success('密码重置成功')
        } catch (error) {
          message.error('密码重置失败')
        }
      },
    })
  }

  // 确认删除
  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      onOk: () => deleteHandle(Number(id)),
    })
  }

  // 表格列定义
  const columns: ColumnsType<SysUser> = [
    {
      title: '用户账号',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="small">
          {hasPermission('sys:user:info') && (
            <Button type="link" size="small" icon={<UserOutlined />} onClick={() => {
              setSelectedUser(record)
              setViewModalVisible(true)
            }}>
              查看
            </Button>
          )}
          {hasPermission('sys:user:update') && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedUser(record)
                setEditModalVisible(true)
              }}
            >
              修改
            </Button>
          )}
          {hasPermission('sys:user:update') && (
            <Button
              type="link"
              size="small"
              icon={<KeyOutlined />}
              onClick={() => resetPassword(record)}
            >
              重置密码
            </Button>
          )}
          {hasPermission('sys:user:delete') && (
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

  // 行选择配置
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys)
    },
  }

  // 处理新增
  const handleCreate = () => {
    setCreateModalVisible(true)
  }

  // 关闭弹窗并重置状态
  const closeModal = (modalSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    modalSetter(false)
    setSelectedUser(null)
  }

  return (
    <Card>
      {/* 搜索表单 */}
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="username">
          <Input placeholder="用户账号" allowClear style={{ width: 150 }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                const values = form.getFieldsValue()
                state.queryForm = values
                state.page = 1
                getDataList()
              }}
            >
              查询
            </Button>
            <Button icon={<RedoOutlined />} onClick={resetQueryForm}>
              重置
            </Button>
            {hasPermission('sys:user:save') && (
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
        rowSelection={rowSelection}
        loading={state.loading}
        pagination={{
          current: state.page,
          pageSize: state.limit,
          total: state.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          pageSizeOptions: state.pageSizes,
          onChange: currentChangeHandle,
          onShowSizeChange: sizeChangeHandle,
        }}
        scroll={{ x: 1400 }}
        bordered
      />

      {/* 新增用户弹窗 */}
      <UserForm
        visible={createModalVisible}
        onSuccess={() => {
          setCreateModalVisible(false)
          getDataList()
        }}
        onCancel={() => closeModal(setCreateModalVisible)}
      />

      {/* 编辑用户弹窗 */}
      <UserForm
        visible={editModalVisible}
        id={selectedUser?.id ? Number(selectedUser.id) : undefined}
        onSuccess={() => {
          setEditModalVisible(false)
          setSelectedUser(null)
          getDataList()
        }}
        onCancel={() => closeModal(setEditModalVisible)}
      />

      {/* 查看用户弹窗 */}
      <UserForm
        visible={viewModalVisible}
        id={selectedUser?.id}
        isView={true}
        onCancel={() => closeModal(setViewModalVisible)}
      />
    </Card>
  )
}



export default UserManagement