import React, {useState} from 'react'
import {Button, Card, Form, Input, message, Modal, Popconfirm, Select, Space, Switch, Table, Tag} from 'antd'
import {PlusOutlined, RedoOutlined, ReloadOutlined, SearchOutlined, UserOutlined} from '@ant-design/icons'
import {useCrud} from '@/hooks/useCrud'
import {useUserStore} from '@/stores'
import {changeSysConfigStatusApi, refreshSysConfigCacheApi} from '@/api/sys/config'
import type {ConfigTypeOption, SysConfig} from '@/types/sys/config'
import type {ColumnsType} from 'antd/es/table'

const { Option } = Select

const ConfigManagement: React.FC = () => {
  const [form] = Form.useForm()
  const { hasPermission } = useUserStore()

  // 弹窗状态管理
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState<SysConfig | null>(null)

  // 配置类型选项
  const configTypeOptions: ConfigTypeOption[] = [
    { label: '字符串', value: 'TEXT_TYPE' },
    { label: '数字', value: 'NUMBER_TYPE' },
    { label: '布尔值', value: 'BOOLEAN_TYPE' },
    { label: '日期时间', value: 'DATETIME_TYPE' },
    { label: '富文本', value: 'RICHTEXT_TYPE' },
    { label: '文件上传', value: 'FILE_TYPE' },
    { label: '下拉选择', value: 'SELECT_TYPE' },
    { label: '开关', value: 'SWITCH_TYPE' }
  ]

  // 使用useCrud hook
  const {
    state,
    getDataList,
    resetQueryForm,
    currentChangeHandle,
    sizeChangeHandle,
    deleteHandle,
  } = useCrud({
    dataListUrl: '/sys/config/page',
    deleteUrl: '/sys/config',
    queryForm: {
      name: '',
      configKey: '',
      type: undefined,
      status: undefined,
    },
  })

  // 修改状态
  const changeStatus = async (record: SysConfig) => {
    try {
      await changeSysConfigStatusApi(record.id, record.status === 1 ? 0 : 1)
      message.success('操作成功')
      getDataList()
    } catch (error) {
      message.error('操作失败')
    }
  }

  // 刷新缓存
  const refreshCache = async () => {
    try {
      await refreshSysConfigCacheApi()
      message.success('缓存刷新成功')
    } catch (error) {
      message.error('缓存刷新失败')
    }
  }

  // 确认删除
  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      onOk: () => deleteHandle(id),
    })
  }

  // 渲染配置值
  const renderConfigValue = (record: SysConfig) => {
    const { configValue, type } = record

    switch (type) {
      case 'BOOLEAN_TYPE':
        return (
          <Tag color={configValue === 'true' ? 'success' : 'error'}>
            {configValue === 'true' ? '是' : '否'}
          </Tag>
        )
      case 'SWITCH_TYPE':
        return (
          <Tag color={configValue === '1' ? 'success' : 'error'}>
            {configValue === '1' ? '开启' : '关闭'}
          </Tag>
        )
      case 'TEXT_TYPE':
      case 'NUMBER_TYPE':
      case 'DATETIME_TYPE':
      default:
        return configValue || '-'
    }
  }

  // 渲染配置类型标签
  const renderConfigType = (type: string) => {
    const option = configTypeOptions.find(opt => opt.value === type)
    return option ? (
      <Tag color="blue">{option.label}</Tag>
    ) : (
      <Tag color="default">未知</Tag>
    )
  }

  // 表格列定义
  const columns: ColumnsType<SysConfig> = [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '配置键',
      dataIndex: 'configKey',
      key: 'configKey',
      width: 200,
    },
    {
      title: '配置值',
      dataIndex: 'configValue',
      key: 'configValue',
      width: 150,
      render: (_, record) => renderConfigValue(record),
    },
    {
      title: '配置类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: renderConfigType,
    },
    {
      title: '系统内置',
      dataIndex: 'isSystem',
      key: 'isSystem',
      width: 100,
      render: (isSystem: number) => (
        <Tag color={isSystem === 1 ? 'orange' : 'blue'}>
          {isSystem === 1 ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number, record: SysConfig) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => changeStatus({ ...record, status: checked ? 1 : 0 })}
          size="small"
          disabled={record.isSystem === 1}
        />
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      render: (remark: string) => remark || '-',
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
      width: 200,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="small">
          {hasPermission('sys:config:info') && (
            <Button type="link" size="small" icon={<UserOutlined />} onClick={() => {
              setSelectedConfig(record)
              setViewModalVisible(true)
            }}>
              查看
            </Button>
          )}
          {hasPermission('sys:config:update') && (
            <Button type="link" size="small" onClick={() => message.info('编辑功能开发中...')}>
              修改
            </Button>
          )}
          {hasPermission('sys:config:delete') && record.isSystem !== 1 && (
            <Popconfirm
              title="确认删除"
              description="确定要删除这条记录吗？"
              onConfirm={() => deleteHandle(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                danger
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  // 行选择配置
  const rowSelection = {
    selectedRowKeys: state.selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      state.selectedRowKeys = selectedRowKeys
    },
  }

  // 处理新增
  const handleCreate = () => {
    setCreateModalVisible(true)
  }

  // 关闭弹窗并重置状态
  const closeModal = (modalSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    modalSetter(false)
    setSelectedConfig(null)
  }

  return (
    <Card>
      {/* 搜索表单 */}
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="name">
          <Input placeholder="配置名称" allowClear style={{ width: 150 }} />
        </Form.Item>
        <Form.Item name="configKey">
          <Input placeholder="配置键" allowClear style={{ width: 150 }} />
        </Form.Item>
        <Form.Item name="type">
          <Select placeholder="配置类型" allowClear style={{ width: 150 }}>
            {configTypeOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
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
            {hasPermission('sys:config:save') && (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                新增
              </Button>
            )}
            {hasPermission('sys:config:refresh') && (
              <Button icon={<ReloadOutlined />} onClick={refreshCache}>
                刷新缓存
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
        scroll={{ x: 1500 }}
        bordered
      />

      {/* 新增配置弹窗 */}
      <Modal
        title="新增配置"
        open={createModalVisible}
        onCancel={() => closeModal(setCreateModalVisible)}
        footer={null}
        width={800}
      >
        <div>
          <p>新增配置表单组件开发中...</p>
          <Button onClick={() => closeModal(setCreateModalVisible)}>完成</Button>
          <Button onClick={() => closeModal(setCreateModalVisible)}>取消</Button>
        </div>
      </Modal>

      {/* 编辑配置弹窗 */}
      <Modal
        title="编辑配置"
        open={editModalVisible}
        onCancel={() => closeModal(setEditModalVisible)}
        footer={null}
        width={800}
      >
        <div>
          <p>编辑配置表单组件开发中...</p>
          <Button onClick={() => closeModal(setEditModalVisible)}>完成</Button>
          <Button onClick={() => closeModal(setEditModalVisible)}>取消</Button>
        </div>
      </Modal>

      {/* 查看配置弹窗 */}
      <Modal
        title="配置详情"
        open={viewModalVisible}
        onCancel={() => closeModal(setViewModalVisible)}
        footer={[
          <Button key="close" onClick={() => closeModal(setViewModalVisible)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedConfig && <ConfigDetail config={selectedConfig} />}
      </Modal>
    </Card>
  )
}

// 配置详情组件
const ConfigDetail: React.FC<{ config: SysConfig }> = ({ config }) => (
  <div>
    <Card title="基本信息" style={{ marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><strong>配置名称:</strong> {config.name}</div>
        <div><strong>配置键:</strong> {config.configKey}</div>
        <div><strong>配置值:</strong> {config.configValue || '无'}</div>
        <div><strong>配置类型:</strong> {config.type}</div>
        <div>
          <strong>系统内置:</strong>
          <Tag color={config.isSystem === 1 ? 'orange' : 'blue'}>
            {config.isSystem === 1 ? '是' : '否'}
          </Tag>
        </div>
        <div>
          <strong>状态:</strong>
          <Tag color={config.status === 1 ? 'success' : 'error'}>
            {config.status === 1 ? '启用' : '禁用'}
          </Tag>
        </div>
      </div>
    </Card>

    <Card title="其他信息" style={{ marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><strong>备注:</strong> {config.remark || '无'}</div>
      </div>
    </Card>

    <Card title="时间信息">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><strong>创建时间:</strong> {config.createTime}</div>
        <div><strong>更新时间:</strong> {config.updateTime}</div>
      </div>
    </Card>
  </div>
)

export default ConfigManagement