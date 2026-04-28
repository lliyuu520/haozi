import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Card, Form, Input, Select, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import { Auth } from '@/components/Auth/Auth';
import { PageContainer } from '@/components/PageContainer/PageContainer';
import { SearchForm } from '@/components/SearchForm/SearchForm';
import {
  createConfig,
  deleteConfig,
  getConfig,
  listConfigs,
  updateConfig,
  type ConfigPayload,
  type ConfigQuery,
  type ConfigRecord,
  type ConfigType,
} from '@/features/system/configs/api';
import { CONFIG_TYPE_OPTIONS, ConfigForm } from '@/features/system/configs/ConfigForm';

const CONFIG_QUERY_KEY = ['system', 'configs'];

const CONFIG_TYPE_LABELS: Record<ConfigType, string> = {
  SWITCH_TYPE: '开关',
  TEXT_TYPE: '文本',
  NUMBER_TYPE: '数字',
  FILE_TYPE: '文件',
  IMAGE_TYPE: '图片',
};

export default function ConfigPage() {
  const queryClient = useQueryClient();
  const { message, modal } = App.useApp();
  const [form] = Form.useForm<Pick<ConfigQuery, 'code' | 'descs' | 'type'>>();
  const [query, setQuery] = useState<ConfigQuery>({ page: 1, pageSize: 10 });
  const [editingConfig, setEditingConfig] = useState<ConfigRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const configsQuery = useQuery({
    queryKey: [...CONFIG_QUERY_KEY, query],
    queryFn: () => listConfigs(query),
  });

  const refreshConfigs = () => {
    queryClient.invalidateQueries({ queryKey: CONFIG_QUERY_KEY });
  };

  const createMutation = useMutation({
    mutationFn: createConfig,
    onSuccess: () => {
      message.success('新增参数配置成功');
      setFormOpen(false);
      refreshConfigs();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ConfigPayload }) => updateConfig(id, payload),
    onSuccess: () => {
      message.success('更新参数配置成功');
      setFormOpen(false);
      setEditingConfig(null);
      refreshConfigs();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConfig,
    onSuccess: () => {
      message.success('删除参数配置成功');
      refreshConfigs();
    },
  });

  const columns: TableProps<ConfigRecord>['columns'] = [
    {
      title: '参数编码',
      dataIndex: 'code',
      width: 220,
      ellipsis: true,
    },
    {
      title: '参数描述',
      dataIndex: 'descs',
      ellipsis: true,
      render: value => value || '-',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 110,
      render: type => <Tag color="blue">{CONFIG_TYPE_LABELS[type as ConfigType] ?? type}</Tag>,
    },
    {
      title: '当前值',
      key: 'value',
      ellipsis: true,
      render: (_, record) => renderConfigValue(record),
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      width: 110,
      render: (_, record) => {
        if (record.type !== 'SWITCH_TYPE') {
          return '-';
        }
        return record.enabled ? <Tag color="green">启用</Tag> : <Tag>停用</Tag>;
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Auth code="sys:config:update">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={async () => {
                const detail = await getConfig(record.id);
                setEditingConfig(detail);
                setFormOpen(true);
              }}
            >
              编辑
            </Button>
          </Auth>
          <Auth code="sys:config:delete">
            <Button
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => {
                modal.confirm({
                  title: '删除参数配置',
                  content: `确定删除参数「${record.code}」吗？`,
                  okText: '删除',
                  okButtonProps: { danger: true },
                  cancelText: '取消',
                  onOk: () => deleteMutation.mutateAsync(record.id),
                });
              }}
            >
              删除
            </Button>
          </Auth>
        </Space>
      ),
    },
  ];

  const handleSearch = (values: Pick<ConfigQuery, 'code' | 'descs' | 'type'>) => {
    setQuery(current => ({ ...current, ...values, page: 1 }));
  };

  const handleSubmit = (values: ConfigPayload) => {
    if (editingConfig) {
      updateMutation.mutate({ id: editingConfig.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <PageContainer title="参数配置">
      <SearchForm<Pick<ConfigQuery, 'code' | 'descs' | 'type'>> form={form} onFinish={handleSearch}>
        <Form.Item name="code" label="参数编码">
          <Input allowClear placeholder="请输入参数编码" />
        </Form.Item>
        <Form.Item name="descs" label="参数描述">
          <Input allowClear placeholder="请输入参数描述" />
        </Form.Item>
        <Form.Item name="type" label="参数类型">
          <Select
            allowClear
            options={CONFIG_TYPE_OPTIONS}
            placeholder="请选择参数类型"
            style={{ minWidth: 140 }}
          />
        </Form.Item>
        <Space className="search-form__actions">
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              form.resetFields();
              setQuery({ page: 1, pageSize: query.pageSize });
            }}
          >
            重置
          </Button>
        </Space>
      </SearchForm>
      <Card
        className="table-card"
        title="参数列表"
        extra={
          <Auth code="sys:config:save">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingConfig(null);
                setFormOpen(true);
              }}
            >
              新增参数
            </Button>
          </Auth>
        }
      >
        <Table<ConfigRecord>
          rowKey="id"
          columns={columns}
          loading={configsQuery.isFetching}
          dataSource={configsQuery.data?.items ?? []}
          scroll={{ x: 980 }}
          pagination={{
            current: query.page,
            pageSize: query.pageSize,
            total: configsQuery.data?.total ?? 0,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
            onChange: (page, pageSize) => setQuery(current => ({ ...current, page, pageSize })),
          }}
        />
      </Card>
      <ConfigForm
        open={formOpen}
        submitting={createMutation.isPending || updateMutation.isPending}
        initialValues={editingConfig}
        onCancel={() => {
          setFormOpen(false);
          setEditingConfig(null);
        }}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}

/**
 * 根据参数类型渲染当前值摘要。
 *
 * @param record 参数记录
 * @returns 当前值摘要
 */
function renderConfigValue(record: ConfigRecord) {
  if (record.type === 'SWITCH_TYPE') {
    return record.enabled ? '启用' : '停用';
  }
  if (record.type === 'NUMBER_TYPE') {
    return record.num ?? '-';
  }
  if (record.type === 'TEXT_TYPE') {
    return record.text || '-';
  }
  if (record.type === 'FILE_TYPE') {
    return `${record.files?.length ?? 0} 个文件`;
  }
  if (record.type === 'IMAGE_TYPE') {
    return `${record.images?.length ?? 0} 张图片`;
  }
  return '-';
}
