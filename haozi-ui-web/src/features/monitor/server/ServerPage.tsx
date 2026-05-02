import { ReloadOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Card, Col, Descriptions, Progress, Row, Statistic, Table, Tag, Typography } from 'antd';
import type { DescriptionsProps, TableProps } from 'antd';
import { PageContainer } from '@/components/PageContainer/PageContainer';
import { getServerInfo, type DiskInfo, type ServerInfo } from '@/features/monitor/server/api';

const SERVER_QUERY_KEY = ['monitor', 'server', 'info'];

export default function ServerPage() {
  const queryClient = useQueryClient();
  const serverQuery = useQuery({
    queryKey: SERVER_QUERY_KEY,
    queryFn: getServerInfo,
  });
  const server = serverQuery.data;

  const diskColumns: TableProps<DiskInfo>['columns'] = [
    {
      title: '磁盘名称',
      dataIndex: 'diskName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '挂载目录',
      dataIndex: 'dirName',
      ellipsis: true,
    },
    {
      title: '文件系统',
      dataIndex: 'diskType',
      width: 140,
      render: value => value || '-',
    },
    {
      title: '总大小',
      dataIndex: 'total',
      width: 120,
    },
    {
      title: '已用',
      dataIndex: 'used',
      width: 120,
    },
    {
      title: '可用',
      dataIndex: 'free',
      width: 120,
    },
    {
      title: '使用率',
      dataIndex: 'usage',
      width: 180,
      render: value => <Progress percent={toPercent(value)} size="small" />,
    },
  ];

  return (
    <PageContainer
      title="服务器监控"
      description="查看当前后端服务所在主机的 CPU、内存、JVM、系统和磁盘状态。"
      extra={
        <Button
          icon={<ReloadOutlined />}
          loading={serverQuery.isFetching}
          onClick={() => queryClient.invalidateQueries({ queryKey: SERVER_QUERY_KEY })}
        >
          刷新
        </Button>
      }
    >
      {serverQuery.isError && (
        <Alert
          showIcon
          type="error"
          message="服务器监控数据加载失败"
          description={getErrorMessage(serverQuery.error)}
        />
      )}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <MetricCard
            loading={serverQuery.isFetching}
            title="CPU 使用率"
            percent={server?.cpu.total}
            summary={server ? `${server.cpu.cpuModel} / ${server.cpu.cpuNum} 核` : '-'}
            details={[
              ['系统', formatPercent(server?.cpu.sys)],
              ['用户', formatPercent(server?.cpu.used)],
              ['等待', formatPercent(server?.cpu.wait)],
              ['空闲', formatPercent(server?.cpu.free)],
            ]}
          />
        </Col>
        <Col span={8}>
          <MetricCard
            loading={serverQuery.isFetching}
            title="物理内存"
            percent={server?.mem.usage}
            summary={server ? `${formatNumber(server.mem.used)} GB / ${formatNumber(server.mem.total)} GB` : '-'}
            details={[
              ['已用', `${formatNumber(server?.mem.used)} GB`],
              ['可用', `${formatNumber(server?.mem.free)} GB`],
            ]}
          />
        </Col>
        <Col span={8}>
          <MetricCard
            loading={serverQuery.isFetching}
            title="JVM 内存"
            percent={server?.jvm.usage}
            summary={server ? `${formatNumber(server.jvm.used)} MB / ${formatNumber(server.jvm.total)} MB` : '-'}
            details={[
              ['最大', `${formatNumber(server?.jvm.max)} GB`],
              ['空闲', `${formatNumber(server?.jvm.free)} MB`],
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card className="table-card" title="系统信息" loading={serverQuery.isFetching}>
            <Descriptions
              bordered
              column={1}
              size="small"
              items={buildSystemItems(server)}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="table-card" title="JVM 信息" loading={serverQuery.isFetching}>
            <Descriptions
              bordered
              column={1}
              size="small"
              items={buildJvmItems(server)}
            />
          </Card>
        </Col>
      </Row>
      <Card className="table-card" title="磁盘信息">
        <Table<DiskInfo>
          rowKey={record => `${record.diskName}-${record.dirName}`}
          columns={diskColumns}
          loading={serverQuery.isFetching}
          dataSource={server?.disks ?? []}
          pagination={false}
          scroll={{ x: 1040 }}
        />
      </Card>
    </PageContainer>
  );
}

type MetricCardProps = {
  loading: boolean;
  title: string;
  percent?: number;
  summary: string;
  details: Array<[string, string]>;
};

function MetricCard({ loading, title, percent, summary, details }: MetricCardProps) {
  return (
    <Card className="table-card" loading={loading}>
      <Statistic title={title} value={toPercent(percent)} suffix="%" precision={2} />
      <Progress percent={toPercent(percent)} />
      <Typography.Text type="secondary">{summary}</Typography.Text>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        {details.map(([label, value]) => (
          <Tag key={label}>
            {label}：{value}
          </Tag>
        ))}
      </div>
    </Card>
  );
}

function buildSystemItems(server?: ServerInfo): DescriptionsProps['items'] {
  return [
    { key: 'computerName', label: '服务器名称', children: server?.sys.computerName || '-' },
    { key: 'computerIp', label: '服务器 IP', children: server?.sys.computerIp || '-' },
    { key: 'osName', label: '操作系统', children: server?.sys.osName || '-' },
    { key: 'osVersion', label: '系统版本', children: server?.sys.osVersion || '-' },
    { key: 'osArch', label: '系统架构', children: server?.sys.osArch || '-' },
  ];
}

function buildJvmItems(server?: ServerInfo): DescriptionsProps['items'] {
  return [
    { key: 'name', label: 'JVM 名称', children: server?.jvm.name || '-' },
    { key: 'version', label: 'Java 版本', children: server?.jvm.version || '-' },
    { key: 'vendor', label: '供应商', children: server?.jvm.vendor || '-' },
    { key: 'startTime', label: '启动时间', children: server?.jvm.startTime || '-' },
    { key: 'runTime', label: '运行时长', children: server?.jvm.runTime || '-' },
    { key: 'home', label: 'JDK 路径', children: server?.jvm.home || '-' },
    { key: 'userDir', label: '项目路径', children: server?.jvm.userDir || '-' },
  ];
}

function toPercent(value?: number) {
  const percent = Number(value);
  if (!Number.isFinite(percent)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Number(percent.toFixed(2))));
}

function formatPercent(value?: number) {
  return `${formatNumber(toPercent(value))}%`;
}

function formatNumber(value?: number) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return '0';
  }
  return number.toFixed(2);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '请稍后重试';
}
