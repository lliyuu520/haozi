'use client';

import React, { useMemo } from 'react';
import {
  Button,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
  MenuOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { MenuTreeNode, MenuType, OpenStyle } from '@/services/menu';

// 菜单类型配置
const MENU_TYPE_CONFIG = {
  [MenuType.MENU]: {
    label: '菜单',
    icon: <MenuOutlined />,
    color: 'blue',
  },
  [MenuType.BUTTON]: {
    label: '按钮',
    icon: <TagOutlined />,
    color: 'green',
  },
  [MenuType.INTERFACE]: {
    label: '接口',
    icon: <ApiOutlined />,
    color: 'orange',
  },
};

// 打开方式配置
const OPEN_STYLE_CONFIG = {
  [OpenStyle.INTERNAL]: {
    label: '内部',
    color: 'default',
  },
  [OpenStyle.EXTERNAL]: {
    label: '外部',
    color: 'purple',
  },
};

interface MenuTableProps {
  dataSource: MenuTreeNode[];
  loading?: boolean;
  onEdit: (record: MenuTreeNode) => void;
  onDelete: (record: MenuTreeNode) => void;
}

export function MenuTable({
  dataSource,
  loading = false,
  onEdit,
  onDelete,
}: MenuTableProps) {
  // 将树形数据展平为表格数据，并添加层级缩进
  const flattenData = useMemo(() => {
    const result: (MenuTreeNode & { level: number })[] = [];

    const flatten = (items: MenuTreeNode[], level = 0) => {
      for (const item of items) {
        result.push({ ...item, level });
        if (item.children && item.children.length > 0) {
          flatten(item.children, level + 1);
        }
      }
    };

    flatten(dataSource);
    return result;
  }, [dataSource]);

  const columns: ColumnsType<MenuTreeNode & { level: number }> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (name: string, record) => {
        const config = MENU_TYPE_CONFIG[record.type];
        return (
          <div style={{ paddingLeft: `${record.level * 24}px` }}>
            <Space>
              {config.icon}
              <Tag color={config.color} size="small">
                {config.label}
              </Tag>
              <span style={{ fontWeight: record.level === 0 ? 'bold' : 'normal' }}>
                {name}
              </span>
            </Space>
          </div>
        );
      },
    },
    {
      title: '路由地址',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      render: (url?: string) => (
        <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">
          {url || '-'}
        </code>
      ),
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      key: 'perms',
      width: 200,
      render: (perms?: string) => (
        perms ? (
          <code className="px-1 py-0.5 bg-green-100 rounded text-xs text-green-800">
            {perms}
          </code>
        ) : '-'
      ),
    },
    {
      title: '打开方式',
      dataIndex: 'openStyle',
      key: 'openStyle',
      width: 100,
      render: (openStyle: OpenStyle) => {
        const config = OPEN_STYLE_CONFIG[openStyle];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '排序',
      dataIndex: 'weight',
      key: 'weight',
      width: 80,
      align: 'center',
      render: (weight: number) => (
        <span className="font-mono text-sm">{weight ?? 0}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time?: string) => (
        <span className="text-xs text-gray-500">{time || '-'}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table<MenuTreeNode & { level: number }>
      rowKey="id"
      loading={loading}
      dataSource={flattenData}
      columns={columns}
      pagination={false}
      scroll={{ x: 900 }}
      size="small"
      rowClassName={(record) => {
        if (record.level === 0) return 'bg-blue-50';
        if (record.level === 1) return 'bg-gray-50';
        return '';
      }}
    />
  );
}