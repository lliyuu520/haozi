// 角色模块专用 Hooks

import { useCallback, useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import { getRolePage, deleteRole } from '@/services/roleService';
import type { Role } from '@/types/role';
import type { RoleQueryParams, RolePageResponse } from '@/types/role';

const INITIAL_PAGE = 1;
const INITIAL_PAGE_SIZE = 20;

type RolePagination = RolePageResponse;

/**
 * 角色管理 Hook
 */
export function useRoleManagement() {
  const [dataSource, setDataSource] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState<RolePagination>({
    list: [],
    total: 0,
    current: INITIAL_PAGE,
    pageSize: INITIAL_PAGE_SIZE,
  });

  const loadData = useCallback(
    async (current: number, pageSize: number, keyword: string) => {
      setLoading(true);
      try {
        const params: RoleQueryParams = {
          current:current,
          pageSize: pageSize,
          name: keyword.trim() || undefined,
        };

        const response = await getRolePage(params);

        setDataSource(response.list);
        setPagination(response);
      } catch (error) {
        console.error('加载角色数据失败:', error);
        message.error('加载角色数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 初始化数据
  useEffect(() => {
    void loadData(INITIAL_PAGE, INITIAL_PAGE_SIZE, '');
  }, [loadData]);

  // 关键字变更重新搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData(INITIAL_PAGE, pagination.pageSize, searchKeyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword, pagination.pageSize, loadData]);

  const handleDelete = useCallback(
    async (role: Role) => {
      try {
        await deleteRole(role.id);
        message.success('删除角色成功');
        void loadData(pagination.current, pagination.pageSize, searchKeyword);
      } catch (error) {
        console.error('删除角色失败:', error);
        message.error('删除角色失败，请稍后重试');
      }
    },
    [loadData, pagination.current, pagination.pageSize, searchKeyword],
  );

  const handleDeleteConfirm = useCallback(
    (role: Role) => {
      Modal.confirm({
        title: '确认删除角色',
        content: `确认要删除角色 "${role.name}" 吗？删除后不可恢复，请谨慎操作。`,
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => handleDelete(role),
      });
    },
    [handleDelete],
  );

  const handlePaginationChange = useCallback(
    (current: number, pageSize: number) => {
      void loadData(current, pageSize, searchKeyword);
    },
    [loadData, searchKeyword],
  );

  const refresh = useCallback(() => {
    void loadData(pagination.current, pagination.pageSize, searchKeyword);
  }, [loadData, pagination.current, pagination.pageSize, searchKeyword]);

  return {
    dataSource,
    loading,
    searchKeyword,
    pagination,
    setSearchKeyword,
    loadData,
    refresh,
    handleDeleteConfirm,
    handlePaginationChange,
  };
}

/**
 * 角色表单 Hook
 */
export function useRoleForm(mode: 'create' | 'edit' | 'view', roleId?: number) {
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<Role>>({});

  const isReadOnly = mode === 'view';
  const isEdit = mode === 'edit';

  return {
    loading,
    initialValues,
    setLoading,
    setInitialValues,
    isReadOnly,
    isEdit,
  };
}
