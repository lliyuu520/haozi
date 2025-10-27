'use client';

import React, { useEffect } from 'react';
import {
  Button,
  Card,
  Select,
  Space,
  Empty,
} from 'antd';
import { PlusOutlined, MenuOutlined, ApiOutlined, TagOutlined } from '@ant-design/icons';
import { MenuType, OpenStyle } from '@/services/menu';
import { useMenuManagement } from './hooks';
import { MenuTable } from './components';
import { MENU_TYPE_CONFIG } from './constants';

const { Option } = Select;

export default function MenuManagementPage() {
  const {
    dataSource,
    loading,
    menuType,
    setMenuType,
    loadData,
    handleAdd,
    handleEdit,
    handleView,
    handleDeleteConfirm
  } = useMenuManagement();

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <div className="page-container">
      <Card
        title="菜单管理"
        extra={
          <Space>
            <Select
              allowClear
              placeholder="菜单类型"
              style={{ width: 140 }}
              value={menuType}
              onChange={setMenuType}
              popupRender={(menu) => (
                <>
                  {menu}
                  <div className="px-2 py-1 text-xs text-gray-500 border-t">
                    过滤显示指定类型的菜单
                  </div>
                </>
              )}
            >
              <Option value={MenuType.MENU}>
                <Space>
                  <MenuOutlined />
                  菜单
                </Space>
              </Option>
              <Option value={MenuType.BUTTON}>
                <Space>
                  <TagOutlined />
                  按钮
                </Space>
              </Option>
              <Option value={MenuType.INTERFACE}>
                <Space>
                  <ApiOutlined />
                  接口
                </Space>
              </Option>
            </Select>
            <Button onClick={() => void loadData()}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建菜单
            </Button>
          </Space>
        }
      >
        {dataSource.length > 0 ? (
          <MenuTable
            dataSource={dataSource}
            loading={loading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDeleteConfirm}
          />
        ) : (
          <Empty
            description="暂无菜单数据"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              创建第一个菜单
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
}

