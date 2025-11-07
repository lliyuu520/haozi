'use client';

import React from 'react';
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  DesktopOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  FolderOpenOutlined,
  ApiOutlined,
  TagOutlined,
} from '@ant-design/icons';

export type MenuIconOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

export const MENU_ICON_OPTIONS: MenuIconOption[] = [
  { value: 'appstore', label: '应用', icon: <AppstoreOutlined /> },
  { value: 'setting', label: '设置', icon: <SettingOutlined /> },
  { value: 'user', label: '用户', icon: <UserOutlined /> },
  { value: 'team', label: '团队', icon: <TeamOutlined /> },
  { value: 'desktop', label: '监控', icon: <DesktopOutlined /> },
  { value: 'file', label: '文档', icon: <FileTextOutlined /> },
  { value: 'database', label: '字典', icon: <DatabaseOutlined /> },
  { value: 'chart', label: '统计', icon: <BarChartOutlined /> },
  { value: 'folder', label: '目录', icon: <FolderOpenOutlined /> },
  { value: 'api', label: '接口', icon: <ApiOutlined /> },
  { value: 'tag', label: '标签', icon: <TagOutlined /> },
];

const MENU_ICON_MAP = MENU_ICON_OPTIONS.reduce<Record<string, React.ReactNode>>((acc, option) => {
  acc[option.value] = option.icon;
  return acc;
}, {});

export const getMenuIcon = (icon?: string) => {
  if (!icon) {
    return null;
  }
  return MENU_ICON_MAP[icon] ?? null;
};
