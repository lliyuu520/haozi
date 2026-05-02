import { DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Space,
  Statistic,
  Table,
  Typography,
} from 'antd';
import type { DescriptionsProps, TableProps } from 'antd';
import { useState } from 'react';
import { Auth } from '@/components/Auth/Auth';
import { PageContainer } from '@/components/PageContainer/PageContainer';
import {
  deleteAllCache,
  deleteCacheKey,
  getCacheInfo,
  getCacheValue,
  listCacheKeys,
  type CacheCommandStat,
} from '@/features/monitor/cache/api';

const CACHE_QUERY_KEY = ['monitor', 'cache'];
const CACHE_INFO_QUERY_KEY = [...CACHE_QUERY_KEY, 'info'];
const CACHE_KEYS_QUERY_KEY = [...CACHE_QUERY_KEY, 'keys'];

export default function CachePage() {
  const queryClient = useQueryClient();
  const { message, modal } = App.useApp();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const cacheInfoQuery = useQuery({
    queryKey: CACHE_INFO_QUERY_KEY,
    queryFn: getCacheInfo,
  });
  const cacheKeysQuery = useQuery({
    queryKey: CACHE_KEYS_QUERY_KEY,
    queryFn: listCacheKeys,
  });
  const cacheValueQuery = useQuery({
    queryKey: [...CACHE_QUERY_KEY, 'value', selectedKey],
    queryFn: () => getCacheValue(selectedKey as string),
    enabled: Boolean(selectedKey),
  });

  const refreshCache = () => {
    queryClient.invalidateQueries({ queryKey: CACHE_QUERY_KEY });
  };

  const deleteKeyMutation = useMutation({
    mutationFn: deleteCacheKey,
    onSuccess: (_, cacheKey) => {
      message.success('删除缓存 Key 成功');
      if (selectedKey === cacheKey) {
        setSelectedKey(null);
      }
      refreshCache();
    },
    onError: error => message.error(getErrorMessage(error)),
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllCache,
    onSuccess: () => {
      message.success('清空缓存成功');
      setSelectedKey(null);
      refreshCache();
    },
    onError: error => message.error(getErrorMessage(error)),
  });

  const keyColumns: TableProps<string>['columns'] = [
    {
      title: '缓存 Key',
      dataIndex: 'key',
      ellipsis: true,
      render: (_, cacheKey) => <Typography.Text copyable>{cacheKey}</Typography.Text>,
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: (_, cacheKey) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => setSelectedKey(cacheKey)}>
            查看
          </Button>
          <Auth code="monitor:cache:all">
            <Button
              danger
              type="link"
              icon={<DeleteOutlined />}
              loading={deleteKeyMutation.isPending && deleteKeyMutation.variables === cacheKey}
              onClick={() => {
                modal.confirm({
                  title: '删除缓存 Key',
                  content: `确定删除「${cacheKey}」吗？`,
                  okText: '删除',
                  okButtonProps: { danger: true },
                  cancelText: '取消',
                  onOk: () => deleteKeyMutation.mutateAsync(cacheKey),
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

  const commandColumns: TableProps<CacheCommandStat>['columns'] = [
    {
      title: '命令',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '调用次数',
      dataIndex: 'value',
      width: 140,
      sorter: (a, b) => Number(a.value) - Number(b.value),
      render: value => formatValue(value),
    },
  ];

  return (
    <PageContainer
      title="缓存监控"
      description="查看 Redis 运行信息、命令统计和缓存 Key 内容。"
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            loading={cacheInfoQuery.isFetching || cacheKeysQuery.isFetching}
            onClick={refreshCache}
          >
            刷新
          </Button>
          <Auth code="monitor:cache:all">
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={deleteAllMutation.isPending}
              onClick={() => {
                modal.confirm({
                  title: '清空全部缓存',
                  content: '确定删除 Redis 中的全部缓存 Key 吗？',
                  okText: '清空',
                  okButtonProps: { danger: true },
                  cancelText: '取消',
                  onOk: () => deleteAllMutation.mutateAsync(),
                });
              }}
            >
              清空全部
            </Button>
          </Auth>
        </Space>
      }
    >
      {(cacheInfoQuery.isError || cacheKeysQuery.isError) && (
        <Alert
          showIcon
          type="error"
          message="缓存监控数据加载失败"
          description={getErrorMessage(cacheInfoQuery.error || cacheKeysQuery.error)}
        />
      )}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card className="table-card" loading={cacheInfoQuery.isFetching}>
            <Statistic title="缓存 Key 数量" value={cacheInfoQuery.data?.keyCount ?? 0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="table-card" loading={cacheInfoQuery.isFetching}>
            <Statistic title="Redis 版本" value={formatValue(cacheInfoQuery.data?.info?.redis_version)} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="table-card" loading={cacheInfoQuery.isFetching}>
            <Statistic title="连接客户端" value={formatValue(cacheInfoQuery.data?.info?.connected_clients)} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card className="table-card" title="Redis 信息" loading={cacheInfoQuery.isFetching}>
            <Descriptions
              bordered
              column={1}
              size="small"
              items={buildRedisItems(cacheInfoQuery.data?.info)}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="table-card" title="命令统计">
            <Table<CacheCommandStat>
              rowKey="name"
              columns={commandColumns}
              loading={cacheInfoQuery.isFetching}
              dataSource={cacheInfoQuery.data?.commandStats ?? []}
              pagination={{ pageSize: 8, showSizeChanger: false }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={14}>
          <Card className="table-card" title="缓存 Key">
            <Table<string>
              rowKey={cacheKey => cacheKey}
              columns={keyColumns}
              loading={cacheKeysQuery.isFetching}
              dataSource={cacheKeysQuery.data ?? []}
              scroll={{ x: 680 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: total => `共 ${total} 个 Key`,
              }}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card className="table-card" title="缓存值" loading={cacheValueQuery.isFetching}>
            {selectedKey ? (
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                <Typography.Text strong copyable>
                  {selectedKey}
                </Typography.Text>
                <Typography.Paragraph
                  copyable
                  style={{
                    background: '#f6f8fa',
                    borderRadius: 8,
                    marginBottom: 0,
                    maxHeight: 360,
                    overflow: 'auto',
                    padding: 12,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {formatCacheValue(cacheValueQuery.data?.cacheValue)}
                </Typography.Paragraph>
              </Space>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="请选择左侧缓存 Key" />
            )}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}

function buildRedisItems(info?: Record<string, string | number | boolean | null>): DescriptionsProps['items'] {
  const fields: Array<[string, string]> = [
    ['redis_mode', '运行模式'],
    ['os', '运行环境'],
    ['tcp_port', '监听端口'],
    ['uptime_in_days', '运行天数'],
    ['used_memory_human', '已用内存'],
    ['maxmemory_human', '最大内存'],
    ['connected_clients', '连接客户端'],
    ['role', '节点角色'],
  ];
  return fields.map(([key, label]) => ({
    key,
    label,
    children: formatValue(info?.[key]),
  }));
}

function formatCacheValue(value: unknown) {
  if (value === undefined || value === null) {
    return '-';
  }
  if (typeof value === 'string') {
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function formatValue(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return '-';
  }
  return String(value);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '请稍后重试';
}
