'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, Select, Space, Empty, Input, Tooltip } from 'antd';
import {
  PlusOutlined,
  MenuOutlined,
  TagOutlined,
  ApiOutlined,
  SearchOutlined,
  ReloadOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { MenuTable } from '@/app/(system)/system/menu/components';
import { MenuType } from '@/services/menu';
import { useMenuManagement } from '@/app/(system)/system/menu/hooks';
import { useSelectedRows, useSetSelectedRows } from '@/stores/menuPageStore';

const { Option } = Select;
const { Search } = Input;

export default function MenuPage() {
  const router = useRouter();
  const {
    dataSource,
    loading,
    menuType,
    searchKeyword,
    pagination,
    setMenuType,
    setSearchKeyword,
    loadData,
    handleDeleteConfirm
  } = useMenuManagement();

  const selectedRowKeys = useSelectedRows();
  const setSelectedRows = useSetSelectedRows();

  // 操作方法
  const handleAddClick = () => {
    router.push('/system/menu/create');
  };

  const handleEditClick = (record: any) => {
    router.push(`/system/menu/${record.id}/edit`);
  };

  const handleViewClick = (record: any) => {
    router.push(`/system/menu/${record.id}/view`);
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleClearFilters = () => {
    setSearchKeyword('');
    setMenuType(undefined);
    setSelectedRows([]);
  };

  const handleRefresh = () => {
    void loadData();
  };

  return (
    <div className="page-container">
      <Card
        title="菜单管理"
        extra={
          <Space wrap>
            {/* 搜索框 */}
            <Search
              placeholder="搜索菜单名称"
              allowClear
              style={{ width: 200 }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              enterButton
            />

            {/* 类型筛选 */}
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

            {/* 操作按钮 */}
            <Tooltip title="刷新数据">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                刷新
              </Button>
            </Tooltip>

            {(searchKeyword || menuType !== undefined || selectedRowKeys.length > 0) && (
              <Tooltip title="清除筛选条件">
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClearFilters}
                >
                  清除
                </Button>
              </Tooltip>
            )}

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
              新建菜单
            </Button>
          </Space>
        }
      >
        {/* 状态信息显示 */}
        {(searchKeyword || menuType !== undefined) && (
          <div style={{ marginBottom: 16, color: '#666' }}>
            <Space>
              {searchKeyword && <span>搜索: "{searchKeyword}"</span>}
              {menuType !== undefined && (
                <span>类型: {menuType === MenuType.MENU ? '菜单' : menuType === MenuType.BUTTON ? '按钮' : '接口'}</span>
              )}
              {selectedRowKeys.length > 0 && <span>已选择 {selectedRowKeys.length} 项</span>}
            </Space>
          </div>
        )}

        {dataSource.length > 0 ? (
          <MenuTable
            dataSource={dataSource}
            loading={loading}
            onEdit={handleEditClick}
            onView={handleViewClick}
            onDelete={handleDeleteConfirm}
          />
        ) : (
          <Empty
            description={
              (searchKeyword || menuType !== undefined)
                ? "没有找到符合条件的菜单数据"
                : "暂无菜单数据"
            }
          >
            <Space>
              {(searchKeyword || menuType !== undefined) && (
                <Button onClick={handleClearFilters}>
                  清除筛选条件
                </Button>
              )}
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
                创建第一个菜单
              </Button>
            </Space>
          </Empty>
        )}
      </Card>
    </div>
  );
}

