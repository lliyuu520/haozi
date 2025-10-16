import React, {useState} from 'react'
import {Button, Card, Form, Input, message, Modal, Select, Space, Table} from 'antd'
import {KeyOutlined, PlusOutlined, RedoOutlined, SearchOutlined, UserOutlined} from '@ant-design/icons'
import {useCrud} from '@/hooks/useCrud'
import {useUserStore} from '@/stores'
import {resetSysUserPasswordApi} from '@/api/sys/user'
import {getSysRoleListApi} from '@/api/sys/role'
import type {SysUser} from '@/types/sys/user'
import type {SysRole} from '@/types/sys/role'
import type {ColumnsType} from 'antd/es/table'

const { Option } = Select

const UserManagement: React.FC = () => {
  const [form] = Form.useForm()
  const { hasPermission } = useUserStore()

  // 弹窗状态管理
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SysUser | null>(null)
  const [roles, setRoles] = useState<SysRole[]>([])

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
      username: '',
    },
  })

  // 获取角色列表
  const getRoles = async () => {
    try {
      const { data } = await getSysRoleListApi({ status: 1 })
      setRoles(data || [])
    } catch (error) {
      console.error('获取角色列表失败:', error)
    }
  }

  // 页面加载时获取角色列表
  React.useEffect(() => {
    getRoles()
  }, [])

  
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
  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      onOk: () => deleteHandle(id),
    })
  }

  // 表格列定义
  const columns: ColumnsType<SysUser> = [
    {
      title: '账号',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
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
            <Button type="link" size="small" onClick={() => message.info('编辑功能开发中...')}>
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
          <Input placeholder="账号" allowClear style={{ width: 150 }} />
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
        scroll={{ x: 1200 }}
        bordered
      />

      {/* 新增用户弹窗 */}
      <Modal
        title="新增用户"
        open={createModalVisible}
        onCancel={() => closeModal(setCreateModalVisible)}
        footer={null}
        width={800}
      >
        <div>
          <p>新增用户表单组件开发中...</p>
          <Button onClick={() => closeModal(setCreateModalVisible)}>完成</Button>
          <Button onClick={() => closeModal(setCreateModalVisible)}>取消</Button>
        </div>
      </Modal>

      {/* 编辑用户弹窗 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => closeModal(setEditModalVisible)}
        footer={null}
        width={800}
      >
        <div>
          <p>编辑用户表单组件开发中...</p>
          <Button onClick={() => closeModal(setEditModalVisible)}>完成</Button>
          <Button onClick={() => closeModal(setEditModalVisible)}>取消</Button>
        </div>
      </Modal>

      {/* 查看用户弹窗 */}
      <Modal
        title="用户详情"
        open={viewModalVisible}
        onCancel={() => closeModal(setViewModalVisible)}
        footer={[
          <Button key="close" onClick={() => closeModal(setViewModalVisible)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedUser && <UserDetail user={selectedUser} />}
      </Modal>
    </Card>
  )
}

// 用户详情组件
const UserDetail: React.FC<{ user: SysUser }> = ({ user }) => (
  <div>
    <Card title="基本信息" style={{ marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><strong>账号:</strong> {user.username}</div>
        <div><strong>用户ID:</strong> {user.id}</div>
        <div><strong>创建者:</strong> {user.creator || '无'}</div>
        <div><strong>更新者:</strong> {user.updater || '无'}</div>
        <div><strong>删除标记:</strong> {user.deleted === 1 ? '已删除' : '正常'}</div>
        {user.roleIdList && (
          <div style={{ gridColumn: 'span 2' }}>
            <strong>角色ID列表:</strong> {user.roleIdList.join(', ') || '无'}
          </div>
        )}
      </div>
    </Card>
    <Card title="时间信息">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><strong>创建时间:</strong> {user.createTime}</div>
        <div><strong>更新时间:</strong> {user.updateTime || '无'}</div>
      </div>
    </Card>
  </div>
)

export default UserManagement