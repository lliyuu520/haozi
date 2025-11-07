'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  List,
  Avatar,
  Table,
  Tag,
} from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// 模拟数据
const mockStats = {
  totalUsers: 1234,
  totalOrders: 856,
  totalRevenue: 98765,
  totalVisits: 12345,
};

const mockTrends = [
  { name: '今日用户', value: 123, trend: 'up', percent: 12 },
  { name: '今日订单', value: 45, trend: 'down', percent: 8 },
  { name: '今日收入', value: 5678, trend: 'up', percent: 23 },
  { name: '今日访问', value: 890, trend: 'up', percent: 5 },
];

const mockActivities = [
  {
    id: 1,
    user: '张三',
    action: '创建了新订单',
    time: '2分钟前',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=1',
  },
  {
    id: 2,
    user: '李四',
    action: '更新了商品信息',
    time: '15分钟前',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=2',
  },
  {
    id: 3,
    user: '王五',
    action: '删除了过期优惠券',
    time: '1小时前',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=3',
  },
  {
    id: 4,
    user: '赵六',
    action: '处理了退款申请',
    time: '2小时前',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=4',
  },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // 这里可以调用API获取真实数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <Title level={2}>仪表盘</Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={mockStats.totalUsers}
              prefix={<UserOutlined className="text-blue-500" />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={mockStats.totalOrders}
              prefix={<ShoppingCartOutlined className="text-green-500" />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总收入"
              value={mockStats.totalRevenue}
              prefix={<DollarOutlined className="text-orange-500" />}
              precision={2}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总访问量"
              value={mockStats.totalVisits}
              prefix={<LineChartOutlined className="text-purple-500" />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* 趋势指标 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="今日数据" loading={loading}>
            <Row gutter={[16, 16]}>
              {mockTrends.map((item, index) => (
                <Col xs={12} sm={6} key={index}>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Text className="text-2xl font-bold">{item.value}</Text>
                      {item.trend === 'up' ? (
                        <ArrowUpOutlined className="text-green-500 ml-2" />
                      ) : (
                        <ArrowDownOutlined className="text-red-500 ml-2" />
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      <Text type="secondary">{item.name}</Text>
                      <Tag
                        color={item.trend === 'up' ? 'green' : 'red'}
                        className="ml-2"
                      >
                        {item.trend === 'up' ? '+' : '-'}{item.percent}%
                      </Tag>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最新动态 */}
        <Col xs={24} lg={12}>
          <Card title="最新动态" loading={loading}>
            <List
              dataSource={mockActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={
                      <div className="flex justify-between items-center">
                        <Text strong>{item.user}</Text>
                        <Text type="secondary" className="text-xs">
                          {item.time}
                        </Text>
                      </div>
                    }
                    description={item.action}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}