import { Card, Col, Row, Statistic, Typography } from 'antd';

export default function DashboardPage() {
  return (
    <div className="page-stack">
      <Typography.Title level={2}>仪表盘</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="前端架构" value="React + AntD" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="授权体系" value="Sa-Token" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="契约模式" value="OpenAPI" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
