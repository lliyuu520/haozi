// 用户模块专用 Hooks

import { useCallback, useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import {
  getUserPage,
  deleteUser,
  resetUserPassword,
} from '@/services/userService';
import { useMenuStore } from '@/stores/menuStore';
import type { User } from '@/types/user';
import type { UserQueryParams, UserPageResponse, ResetPasswordParams } from '@/types/user';

const INITIAL_PAGE = 1;
const INITIAL_PAGE_SIZE = 20;

type UserPagination = UserPageResponse;

/**
 * 用户管理 Hook
 */
export function useUserManagement() {
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [pagination, setPagination] = useState<UserPagination>({
    list: [],
    total: 0,
    current: INITIAL_PAGE,
    pageSize: INITIAL_PAGE_SIZE,
  });
  const { refreshAuthority } = useMenuStore();

  const loadData = useCallback(
    async (current: number, pageSize: number, keyword: string, status?: boolean) => {
      setLoading(true);
      try {
        const params: UserQueryParams = {
          current: current,
          pageSize: pageSize,
          ...(keyword.trim() && { username: keyword.trim() }),
          ...(status !== undefined && { enabled: status }),
        };

        const response = await getUserPage(params);

        setDataSource(response.list);
        setPagination(response);
      } catch (error) {
        console.error('加载用户数据失败:', error);
        message.error('加载用户数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 初始化数据
  useEffect(() => {
    void loadData(INITIAL_PAGE, INITIAL_PAGE_SIZE, '', undefined);
  }, [loadData]);

  // 搜索条件变更重新搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData(INITIAL_PAGE, pagination.pageSize, searchKeyword, statusFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword, statusFilter, pagination.pageSize, loadData]);

  const handleDelete = useCallback(
    async (user: User) => {
      try {
        await deleteUser(user.id);
        message.success('删除用户成功');

        // 刷新用户权限和菜单
        try {
          await refreshAuthority();
          console.log('用户权限已刷新');
        } catch (error) {
          console.error('刷新权限失败:', error);
          // 权限刷新失败不影响删除操作成功
        }

        void loadData(pagination.current, pagination.pageSize, searchKeyword, statusFilter);
      } catch (error) {
        console.error('删除用户失败:', error);
        message.error('删除用户失败，请稍后重试');
      }
    },
    [loadData, pagination.current, pagination.pageSize, searchKeyword, statusFilter, refreshAuthority],
  );

  const handleDeleteConfirm = useCallback(
    (user: User) => {
      Modal.confirm({
        title: '确认删除用户',
        content: `确认要删除用户 "${user.username}" 吗？删除后不可恢复，请谨慎操作。`,
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => handleDelete(user),
      });
    },
    [handleDelete],
  );

  const handleResetPassword = useCallback(
    async (user: User) => {
      Modal.confirm({
        title: '重置密码',
        content: `确认要重置用户 "${user.username}" 的密码吗？重置后密码将设置为：123456`,
        okText: '确认重置',
        okType: 'primary',
        cancelText: '取消',
        onOk: async () => {
          try {
            const params: ResetPasswordParams = {
              newPassword: '123456',
            };
            await resetUserPassword(user.id, params);
            message.success('重置密码成功');
          } catch (error) {
            console.error('重置密码失败:', error);
            message.error('重置密码失败，请稍后重试');
          }
        },
      });
    },
    [],
  );

  const handlePaginationChange = useCallback(
    (current: number, pageSize: number) => {
      void loadData(current, pageSize, searchKeyword, statusFilter);
    },
    [loadData, searchKeyword, statusFilter],
  );

  const refresh = useCallback(() => {
    void loadData(pagination.current, pagination.pageSize, searchKeyword, statusFilter);
  }, [loadData, pagination.current, pagination.pageSize, searchKeyword, statusFilter]);

  return {
    dataSource,
    loading,
    searchKeyword,
    statusFilter,
    pagination,
    setSearchKeyword,
    setStatusFilter,
    loadData,
    refresh,
    handleDeleteConfirm,
    handleResetPassword,
    handlePaginationChange,
  };
}

/**
 * 用户表单 Hook
 */
export function useUserForm(mode: 'create' | 'edit' | 'view', _userId?: string) {
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<User>>({});

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