import React, { useCallback, useEffect, useState } from 'react';
import { Table, TableProps, Pagination, PaginationProps, Input, Select, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

export interface QueryParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: boolean | undefined;
}

export interface PaginationResponse {
  total: number;
  current: number;
  pageSize: number;
}

export interface ManagementTableProps<T = any> {
  // 数据展示
  dataSource: T[];
  loading: boolean;
  pagination: PaginationResponse;

  // 搜索与筛选
  searchKeyword: string;
  statusFilter: boolean | undefined;
  showStatusFilter?: boolean;
  statusFilterOptions?: Array<{ label: string; value: boolean | undefined }>;

  // 表格配置
  columns: TableProps<T>['columns'];
  rowKey?: string;

  // 交互回调
  onSearch: (keyword: string) => void;
  onStatusFilter: (status: boolean | undefined) => void;
  onPaginationChange: (current: number, pageSize: number) => void;
  onRefresh: () => void;

  // 快捷操作按钮
  extraActions?: React.ReactNode;

  // 自定义表格空态
  emptyContent?: React.ReactNode;

  // 自定义搜索栏
  searchPlaceholder?: string;
  statusFilterPlaceholder?: string;
  tableSize?: TableProps<T>['size'];
}

const DEFAULT_STATUS_OPTIONS = [
  { label: '全部', value: undefined },
  { label: '启用', value: true },
  { label: '禁用', value: false },
];

const INITIAL_PAGE = 1;
const INITIAL_PAGE_SIZE = 20;

function ManagementTable<T extends Record<string, any>>({
  dataSource,
  loading,
  pagination,
  searchKeyword,
  statusFilter,
  showStatusFilter = true,
  statusFilterOptions = DEFAULT_STATUS_OPTIONS,
  columns,
  rowKey = 'id',
  onSearch,
  onStatusFilter,
  onPaginationChange,
  onRefresh,
  extraActions,
  emptyContent,
  searchPlaceholder = '请输入关键词搜索',
  statusFilterPlaceholder = '状态筛选',
  tableSize = 'middle',
}: ManagementTableProps<T>) {
  // 搜索防抖
  const [tempSearchKeyword, setTempSearchKeyword] = useState(searchKeyword);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tempSearchKeyword !== searchKeyword) {
        onSearch(tempSearchKeyword);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [tempSearchKeyword, searchKeyword, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearchKeyword(e.target.value);
  };

  const handleSearch = () => {
    onSearch(tempSearchKeyword);
  };

  const handleStatusFilterChange = (value: boolean | undefined) => {
    onStatusFilter(value);
  };

  const handlePaginationChange: PaginationProps['onChange'] = (current, pageSize) => {
    onPaginationChange(current, pageSize);
  };

  const handleRefresh = () => {
    onRefresh();
  };

  return (
    <div className="management-table">
      {/* 搜索和操作区域 */}
      <div className="mb-4 flex justify-between items-center gap-4">
        <Space size="middle">
          <Search
            placeholder={searchPlaceholder}
            allowClear
            value={tempSearchKeyword}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />

          {showStatusFilter && (
            <Select
              placeholder={statusFilterPlaceholder}
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{ width: 120 }}
              allowClear={false}
            >
              {statusFilterOptions.map((option) => (
                <Option key={String(option.value)} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          )}
        </Space>

        <Space>
          {extraActions}
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            刷新
          </Button>
        </Space>
      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={rowKey}
        size={tableSize}
        pagination={false}
        scroll={{ x: 'max-content' }}
        locale={emptyContent ? { emptyText: emptyContent } : undefined}
      />

      {/* 分页 */}
      <div className="mt-4 flex justify-end">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePaginationChange}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) =>
            `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }
          pageSizeOptions={['10', '20', '50', '100']}
          locale={{
            items_per_page: '条/页',
          }}
        />
      </div>
    </div>
  );
}

export default ManagementTable;
