// 菜单模块专用Hooks

import { useCallback, useEffect } from 'react';
import { message, Modal } from 'antd';
import {
  MenuTreeNode,
  getMenuListNavigable,
  deleteMenu
} from '@/services/menu';
import { useMenuPageStore, MenuType, useDataSource, useLoading, useMenuType, useSearchKeyword, usePagination } from '@/stores/menuPageStore';

/**
 * 菜单管理Hook - 使用全局状态管理
 */
export function useMenuManagement() {
  // 从全局状态获取数据（使用单独的 hooks 避免对象创建）
  const dataSource = useDataSource();
  const loading = useLoading();
  const menuType = useMenuType();
  const searchKeyword = useSearchKeyword();
  const pagination = usePagination();

  // 使用原始 store 的 actions 函数
  const setDataSource = useMenuPageStore((state) => state.setDataSource);
  const setLoading = useMenuPageStore((state) => state.setLoading);
  const setMenuType = useMenuPageStore((state) => state.setMenuType);
  const setSearchKeyword = useMenuPageStore((state) => state.setSearchKeyword);
  const setPagination = useMenuPageStore((state) => state.setPagination);
  const updateLastTime = useMenuPageStore((state) => state.updateLastTime);

  // 加载菜单数据
  const loadData = useCallback(async (keepPagination = false) => {
    setLoading(true);
    try {
      const response = await getMenuListNavigable({
        type: menuType
      });

      const menuData = response.data ?? [];
      setDataSource(menuData);

      // 更新分页信息 - 暂时使用数据长度作为总数
      const totalCount = menuData.length;
      setPagination({
        total: totalCount,
        current: keepPagination ? pagination.current : 1,
      });

      updateLastTime();
    } catch (error) {
      message.error('加载菜单数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [menuType, setDataSource, setLoading, setPagination, updateLastTime]);

  // 初始加载数据（只在组件挂载时执行一次）
  useEffect(() => {
    // 如果没有数据，则加载
    if (dataSource.length === 0) {
      void loadData();
    }
  }, []); // 移除 loadData 依赖，避免无限循环

  // 当筛选条件变化时，重新加载数据
  useEffect(() => {
    if (dataSource.length > 0) {
      void loadData();
    }
  }, [menuType, searchKeyword]); // 只依赖筛选条件

  // 处理删除
  const handleDelete = useCallback(async (menuId: string) => {
    try {
      await deleteMenu(menuId);
      message.success('删除成功');
      void loadData(true); // 删除后保持当前分页
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
    // 数据状态（从全局状态读取）
    dataSource,
    loading,
    menuType,
    searchKeyword,
    pagination,

    // 操作方法（使用全局状态的方法）
    setMenuType,
    setSearchKeyword,
    setPagination,
    loadData,
    handleDeleteConfirm
  };
}

// 所有单独的 hooks 都在 menuPageStore.ts 中定义