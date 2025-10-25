'use client';

import React from 'react';
import { Card, Button, Space, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function SimpleMenuPage() {
  return (
    <div className="page-container">
      <Card
        title="菜单管理"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>
              新建菜单
            </Button>
          </Space>
        }
      >
        <Empty
          description="菜单管理功能正在开发中..."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    </div>
  );
}