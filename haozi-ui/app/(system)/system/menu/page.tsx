'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, Select, Space, Empty } from 'antd';
import { PlusOutlined, MenuOutlined, TagOutlined, ApiOutlined } from '@ant-design/icons';
import { MenuTable } from '@/app/(system)/system/menu/components';
import { MenuType } from '@/services/menu';
import { useMenuManagement } from '@/app/(system)/system/menu/hooks';

const { Option } = Select;

export default function MenuPage() {
  const router = useRouter();
  const {
    dataSource,
    loading,
    menuType,
    setMenuType,
    loadData,
    handleDeleteConfirm
  } = useMenuManagement();

  
  // 重构操作方法
  const handleAddClick = () => {
    router.push('/system/menu/create');
  };

  const handleEditClick = (record: any) => {
    router.push(`/system/menu/${record.id}/edit`);
  };

  const handleViewClick = (record: any) => {
    router.push(`/system/menu/${record.id}/view`);
  };

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
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
              新建菜单
            </Button>
          </Space>
        }
      >
        {dataSource.length > 0 ? (
          <MenuTable
            dataSource={dataSource}
            loading={loading}
            onEdit={handleEditClick}
            onView={handleViewClick}
            onDelete={handleDeleteConfirm}
          />
        ) : (
          <Empty description="暂无菜单数据">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
              创建第一个菜单
            </Button>
          </Empty>
        )}
      </Card>

    </div>
  );
}

