'use client';

import React from 'react';
import { Menu, Typography } from 'antd';
import type { MenuItem } from '@/types/menu';
import type { MenuProps } from 'antd';
import { getMenuIcon } from '@/constants/menuIcons';

const { Text } = Typography;
type AntdMenuItem = Required<MenuProps>['items'][number];

interface MenuTreeProps {
  menuItems: MenuItem[];
  selectedKeys?: string[];
  openKeys?: string[];
  onSelect?: MenuProps['onSelect'];
  onOpenChange?: MenuProps['onOpenChange'];
  mode?: 'vertical' | 'horizontal' | 'inline';
  inlineCollapsed?: boolean;
}

const renderMenuItem = (item: MenuItem): AntdMenuItem => {
  return {
    key: item.id.toString(),
    icon: getMenuIcon(item.icon),
    label: item.name,
    children: item.children?.map(renderMenuItem),
  };
};

export function MenuTree({
  menuItems,
  selectedKeys,
  openKeys,
  onSelect,
  onOpenChange,
  mode = 'inline',
  inlineCollapsed = false,
}: MenuTreeProps) {
  const items = menuItems
    .filter(item => item.visible !== false)
    .map(renderMenuItem);

  return (
    <div className="menu-tree">
      {menuItems.length > 0 ? (
        <Menu
          mode={mode}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onSelect={onSelect}
          onOpenChange={onOpenChange}
          inlineCollapsed={mode === 'inline' ? inlineCollapsed : undefined}
          items={items}
          className="custom-menu"
        />
      ) : (
        <div className="menu-empty">
          <Text type="secondary" className="text-center">
            暂无菜单数据
          </Text>
        </div>
      )}
    </div>
  );
}

export default MenuTree;

