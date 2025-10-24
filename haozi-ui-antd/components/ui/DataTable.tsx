'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableProps,
  Pagination,
  PaginationProps,
  Space,
  Button,
  Input,
  Card,
  Tooltip,
  Popconfirm,
  message,
  Checkbox,
  Dropdown,
  type MenuProps,
} from 'antd';
import type { ColumnsType, TableColumnType } from 'antd/es/table';
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { debounce } from '@/lib/utils';

// 数据表格列类型
export interface DataTableColumn<T = any> extends TableColumnType<T> {
  hideInSearch?: boolean; // 是否在搜索中隐藏
  searchField?: string; // 搜索字段名
  valueType?: 'input' | 'select' | 'date' | 'dateRange'; // 搜索值类型
  searchOptions?: { label: string; value: any }[]; // 搜索选项
}

// 分页参数
export interface PaginationParams {
  current: number;
  pageSize: number;
  total: number;
}

// 搜索参数
export interface SearchParams {
  [key: string]: any;
}

// 数据表格Props
export interface DataTableProps<T = any> extends Omit<TableProps<T>, 'columns'> {
  columns: DataTableColumn<T>[];
  loading?: boolean;
  dataSource: T[];
  pagination?: PaginationProps | false;
  searchParams?: SearchParams;
  onSearch?: (params: SearchParams) => void;
  onReset?: () => void;
  rowSelection?: any;
  actions?: {
    add?: () => void;
    export?: (params: SearchParams) => void;
    refresh?: () => void;
    delete?: (selectedRows: T[]) => void;
    custom?: React.ReactNode;
  };
  tableActions?: {
    edit?: (record: T) => void;
    delete?: (record: T) => void;
    custom?: (record: T) => React.ReactNode;
  };
}

function DataTable<T extends Record<string, any>>({
  columns = [],
  loading = false,
  dataSource = [],
  pagination,
  searchParams = {},
  onSearch,
  onReset,
  rowSelection,
  actions,
  tableActions,
  ...tableProps
}: DataTableProps<T>) {
  const [localSearch, setLocalSearch] = useState<SearchParams>(searchParams);
  const [expanded, setExpanded] = useState(false);
  const searchInputRef = useRef<any>(null);

  // 同步外部搜索参数
  useEffect(() => {
    setLocalSearch(searchParams);
  }, [searchParams]);

  // 处理搜索
  const handleSearch = (field: string, value: any) => {
    const newSearch = { ...localSearch, [field]: value };
    setLocalSearch(newSearch);
    onSearch?.(newSearch);
  };

  // 防抖搜索
  const debouncedSearch = debounce(handleSearch, 300);

  // 重置搜索
  const handleReset = () => {
    const newSearch: SearchParams = {};

    // 清空所有搜索值
    columns.forEach(column => {
      if (column.searchField && column.dataIndex) {
        newSearch[column.searchField] = undefined;
      }
    });

    setLocalSearch(newSearch);
    onSearch?.(newSearch);
    onReset?.();
  };

  // 刷新
  const handleRefresh = () => {
    actions?.refresh?.();
  };

  // 获取搜索列
  const searchColumns = columns.filter(column => !column.hideInSearch && column.dataIndex);

  // 渲染搜索表单
  const renderSearchForm = () => {
    if (searchColumns.length === 0) return null;

    return (
      <Card className="mb-4" size="small">
        <div className="flex flex-wrap gap-4 items-end">
          {searchColumns.map((column) => {
            const dataIndex = Array.isArray(column.dataIndex)
              ? column.dataIndex.join('.')
              : column.dataIndex as string;
            const searchField = column.searchField || dataIndex;

            if (column.valueType === 'select') {
              return (
                <div key={searchField} className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium mb-1">
                    {column.title}
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={localSearch[searchField] || ''}
                    onChange={(e) => handleSearch(searchField, e.target.value)}
                  >
                    <option value="">全部</option>
                    {column.searchOptions?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={searchField} className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-1">
                  {column.title}
                </label>
                <Input
                  placeholder={`请输入${column.title}`}
                  value={localSearch[searchField] || ''}
                  onChange={(e) => debouncedSearch(searchField, e.target.value)}
                  allowClear
                />
              </div>
            );
          })}

          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={() => onSearch?.(localSearch)}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </div>
      </Card>
    );
  };

  // 渲染表格操作列
  const getActionColumn = (): DataTableColumn<T> => {
    if (!tableActions) return null as any;

    return {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        const actionItems = [];

        if (tableActions.edit) {
          actionItems.push({
            key: 'edit',
            label: '编辑',
            icon: <EditOutlined />,
            onClick: () => tableActions.edit!(record),
          });
        }

        if (tableActions.delete) {
          actionItems.push({
            key: 'delete',
            label: (
              <Popconfirm
                title="确认删除"
                description="确定要删除这条记录吗？"
                onConfirm={() => tableActions.delete!(record)}
              >
                <span>删除</span>
              </Popconfirm>
            ),
            icon: <DeleteOutlined />,
            danger: true,
          });
        }

        if (tableActions.custom) {
          const customElement = tableActions.custom(record);
          if (customElement) {
            actionItems.push({
              key: 'custom',
              label: customElement,
            });
          }
        }

        if (actionItems.length === 0) return null;

        if (actionItems.length === 1) {
          return (
            <Button
              type="link"
              size="small"
              icon={actionItems[0].icon}
              onClick={() => actionItems[0].onClick?.()}
              danger={actionItems[0].danger}
            >
              {actionItems[0].label}
            </Button>
          );
        }

        const menuItems: MenuProps['items'] = actionItems.map((item, index) => ({
          key: item.key,
          icon: item.icon,
          danger: item.danger,
          label: item.label,
          onClick: item.onClick,
        }));

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="link" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    } as DataTableColumn<T>;
  };

  // 处理表格列
  const processedColumns = [
    ...columns,
    ...tableActions ? [getActionColumn()] : [],
  ];

  return (
    <div className="fade-in">
      {/* 工具栏 */}
      {(actions || expanded) && (
        <Card className="mb-4" size="small">
          <div className="flex justify-between items-center">
            <Space>
              {actions.add && (
                <Button type="primary" onClick={actions.add}>
                  新增
                </Button>
              )}
              {actions.delete && rowSelection && (
                <Popconfirm
                  title="批量删除"
                  description="确定要删除选中的记录吗？"
                  onConfirm={() => actions.delete!(rowSelection.selectedRows || [])}
                  disabled={!rowSelection.selectedRows?.length}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    disabled={!rowSelection.selectedRows?.length}
                  >
                    批量删除
                  </Button>
                </Popconfirm>
              )}
              {actions.export && (
                <Button
                  icon={<ExportOutlined />}
                  onClick={() => actions.export!(localSearch)}
                >
                  导出
                </Button>
              )}
            </Space>

            <Space>
              {actions.refresh && (
                <Tooltip title="刷新">
                  <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
                </Tooltip>
              )}
              {searchColumns.length > 0 && (
                <Tooltip title={expanded ? '收起搜索' : '展开搜索'}>
                  <Button
                    icon={<SearchOutlined />}
                    onClick={() => setExpanded(!expanded)}
                  />
                </Tooltip>
              )}
            </Space>
          </div>
        </Card>
      )}

      {/* 搜索表单 */}
      {expanded && renderSearchForm()}

      {/* 数据表格 */}
      <Card className="table-container">
        <Table
          loading={loading}
          dataSource={dataSource}
          columns={processedColumns as ColumnsType<T>}
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          size="middle"
          {...tableProps}
        />
      </Card>
    </div>
  );
}

export default DataTable;