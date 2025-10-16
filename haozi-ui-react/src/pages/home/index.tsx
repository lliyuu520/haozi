import React from 'react'
import {Card, Col, Row, Statistic, Timeline} from 'antd'
import {DollarOutlined, RiseOutlined, ShoppingCartOutlined, UserOutlined} from '@ant-design/icons'

const Home: React.FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="今日订单"
              value={93}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="今日收入"
              value={15820}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="增长率"
              value={12.5}
              precision={1}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="系统公告" style={{ height: '300px' }}>
            <Timeline
              items={[
                { children: '系统升级完成，新增多项功能' },
                { children: '数据备份功能已上线' },
                { children: '移动端应用发布v1.0版本' },
                { children: '系统维护通知：本周六凌晨2点-4点' },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="快捷操作" style={{ height: '300px' }}>
            <div style={{ padding: '20px' }}>
              <p>1. 用户管理</p>
              <p>2. 角色权限</p>
              <p>3. 系统配置</p>
              <p>4. 数据导出</p>
              <p>5. 日志查看</p>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="欢迎使用业务管理系统">
            <p>本系统是基于React 18 + Ant Design构建的现代化业务管理平台。</p>
            <p>主要功能模块包括：</p>
            <ul>
              <li>系统管理：用户管理、角色管理、菜单管理、系统配置</li>
              <li>渠道管理：经销商管理、区域管理、业务员管理</li>
              <li>二维码管理：码关联、生成记录、收集记录</li>
              <li>门店管理：门店信息、配送记录、库存管理</li>
              <li>追溯管理：产品管理、礼品管理、营销管理</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home