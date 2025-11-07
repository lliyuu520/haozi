// 菜单模块专用Hooks

import { useCallback, useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import {
  MenuTreeNode,
  getMenuListNavigable,
  deleteMenu,
  MenuType
} from '@/services/menu';

/**
 * 菜单管理Hook
 */
export function useMenuManagement() {
  const [dataSource, setDataSource] = useState<MenuTreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuType, setMenuType] = useState<MenuType | undefined>();

  // 加载菜单数据
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMenuListNavigable({ type: menuType });
      const menuData = response.data ?? [];
      setDataSource(menuData);
    } catch (error) {
      message.error('加载菜单数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [menuType]);

  // 初始加载数据
  useEffect(() => {
    void loadData();
  }, [loadData]);

  // 处理删除
  const handleDelete = useCallback(async (menuId: string) => {
    try {
      await deleteMenu(menuId);
      message.success('删除成功');
      void loadData();
    } catch (error) {
      message.error('删除失败，请稍后再试');
    }
  }, [loadData]);

  // 处理删除确认
  const handleDeleteConfirm = useCallback((record: MenuTreeNode) => {
    Modal.confirm({
      title: '确认删除菜单',
      content: `确定要删除菜单 "${record.name}" 吗？删除后不可恢复，请谨慎操作。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => handleDelete(record.id),
    });
  }, [handleDelete]);

  return {
    // 数据状态
    dataSource,
    loading,
    menuType,
    setMenuType,

    // 操作方法
    loadData,
    handleDeleteConfirm
  };
}