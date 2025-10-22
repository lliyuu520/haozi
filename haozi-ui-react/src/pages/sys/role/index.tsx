import React, {useEffect, useState} from 'react'
import {Button, Card, Form, Input, Modal, Space, Table} from 'antd'
import {useCrud} from '@/hooks/useCrud'
import {useUserStore} from '@/stores'
import type {SysRole} from '@/types/sys/role'
import type {ColumnsType} from 'antd/es/table'
import AddOrUpdate from './addOrUpdate.tsx'


const RoleManagement: React.FC = () => {
  const [form] = Form.useForm()
  const { hasPermission } = useUserStore()
  const [modalVisible, setModalVisible] = useState(false)
  const [editId, setEditId] = useState<number | undefined>()

  const {
    state,
    getDataList,
    resetQueryForm,
    currentChangeHandle,
    sizeChangeHandle,
    deleteHandle,
  } = useCrud({
    dataListUrl: '/sys/role/page',
    deleteUrl: '/sys/role',
    queryForm: {
      name: '',
      code: '',
      status: undefined,
    },
  })

  useEffect(() => {
    getDataList()
  }, [])

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      onOk: () => deleteHandle(id),
    })
  }

  const handleAdd = () => {
    setEditId(undefined)
    setModalVisible(true)
  }

  const handleEdit = (id: number) => {
    setEditId(id)
    setModalVisible(true)
  }

  const handleModalSuccess = () => {
    setModalVisible(false)
    getDataList()
  }

  const handleModalCancel = () => {
    setModalVisible(false)
  }



  const columns: ColumnsType<SysRole> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="small">
          {hasPermission('sys:role:update') && (
            <Button
              type="link"
              size="small"
              onClick={() => handleEdit(record.id)}
            >
              编辑
            </Button>
          )}
          {hasPermission('sys:role:delete') && (
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

  
  return (
    <Card>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="name">
          <Input placeholder="角色名称" allowClear style={{ width: 150 }} />
        </Form.Item>
        <Form.Item>
          <Space>
            {hasPermission('sys:role:save') && (
              <Button
                type="primary"
                onClick={handleAdd}
              >
                新增
              </Button>
            )}
            <Button
              type="primary"
              onClick={() => {
                state.queryForm = form.getFieldsValue()
                state.page = 1
                getDataList()
              }}
            >
              查询
            </Button>
            <Button onClick={resetQueryForm}>
              重置
            </Button>
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
        scroll={{ x: 1200 }}
        bordered
      />

      <AddOrUpdate
        visible={modalVisible}
        id={editId}
        onSuccess={handleModalSuccess}
        onCancel={handleModalCancel}
      />
    </Card>
  )
}

export default RoleManagement
