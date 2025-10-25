'use client';

import React, { useEffect, useState } from 'react';
import { Card, Button, Descriptions, Tag, Spin } from 'antd';
import { useMenuStore } from '@/stores/menuStore';

export default function MenuDebugPage() {
  const { menus, fetchMenus, generateMenus, getFlattenMenus } = useMenuStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔍 Debug: Fetching menus...');
        await fetchMenus();
        console.log('🔍 Debug: Menus fetched successfully');
      } catch (error) {
        console.error('❌ Debug: Failed to fetch menus:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchMenus]);

  const menuTree = generateMenus();
  const flattenMenus = getFlattenMenus();

  return (
    <div className="page-container">
      <Card title="菜单调试信息" extra={<Button onClick={() => window.location.reload()}>刷新</Button>}>
        <Spin spinning={loading}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="原始菜单数据">
              <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                {JSON.stringify(menus, null, 2)}
              </pre>
            </Descriptions.Item>

            <Descriptions.Item label="生成的菜单树">
              <pre style={{ backgroundColor: '#f0f8ff', padding: '10px', fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                {JSON.stringify(menuTree, null, 2)}
              </pre>
            </Descriptions.Item>

            <Descriptions.Item label="展平菜单">
              <pre style={{ backgroundColor: '#f6ffed', padding: '10px', fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                {JSON.stringify(flattenMenus, null, 2)}
              </pre>
            </Descriptions.Item>

            <Descriptions.Item label="统计信息">
              <div>
                <Tag color="blue">原始菜单: {menus.length}</Tag>
                <Tag color="green">树形菜单: {menuTree.length}</Tag>
                <Tag color="orange">展平菜单: {flattenMenus.length}</Tag>
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="前3个菜单项">
              <div>
                {flattenMenus.slice(0, 3).map((menu, index) => (
                  <div key={index} style={{ marginBottom: '8px', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                    <div><strong>ID:</strong> {menu.id}</div>
                    <div><strong>名称:</strong> {menu.name}</div>
                    <div><strong>路径:</strong> {menu.path || 'null'}</div>
                    <div><strong>URL:</strong> {menu.url || 'null'}</div>
                    <div><strong>类型:</strong> {menu.type}</div>
                    <div><strong>可见:</strong> {menu.visible ? '是' : '否'}</div>
                  </div>
                ))}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Spin>
      </Card>
    </div>
  );
}