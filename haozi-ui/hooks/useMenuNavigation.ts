'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MenuNavigationHelper, NavigableMenuItem } from '@/services/menuService';

/**
 * 菜单导航 Hook
 * 提供菜单导航相关的功能，消除硬编码路由
 */
export function useMenuNavigation() {
  const router = useRouter();

  /**
   * 导航到菜单页面
   * @param menu 菜单项或URL字符串
   */
  const navigateToMenu = useCallback((menu: NavigableMenuItem | string) => {
    let route: string;

    if (typeof menu === 'string') {
      route = MenuNavigationHelper.normalizeMenuUrl(menu);
      route = route.startsWith('/') ? route : `/${route}`;
    } else {
      route = menu.getRoute();
    }

    router.push(route);
  }, [router]);

  /**
   * 打开创建模态框
   * @param baseUrl 基础URL，如 "system/menu/page"
   */
  const openCreateModal = useCallback((baseUrl: string) => {
    const navigableMenu = MenuNavigationHelper.makeNavigable({
      id: 'temp',
      url: baseUrl,
      name: '临时菜单'
    } as any);

    router.push(navigableMenu.getModalRoute('create'));
  }, [router]);

  /**
   * 打开编辑模态框
   * @param menu 菜单项
   */
  const openEditModal = useCallback((menu: NavigableMenuItem) => {
    router.push(menu.getModalRoute('edit', menu.id));
  }, [router]);

  /**
   * 返回基础页面
   * @param menu 菜单项
   */
  const navigateToBase = useCallback((menu: NavigableMenuItem) => {
    router.push(menu.getBasePath());
  }, [router]);

  /**
   * 关闭模态框并返回基础页面
   * @param currentPath 当前路径
   */
  const closeModal = useCallback((currentPath?: string) => {
    if (currentPath) {
      const basePath = currentPath.replace(/\/modal\/[^\/]*$/, '').replace(/\/modal\/[^\/]*\/[^\/]*$/, '');
      router.push(basePath);
    } else {
      router.back();
    }
  }, [router]);

  /**
   * 创建当前页面的导航信息
   * @param pageUrl 当前页面URL
   * @param pageName 页面名称
   * @returns 可导航的菜单项
   */
  const createCurrentPageNavigation = useCallback((pageUrl: string, pageName: string) => {
    return MenuNavigationHelper.makeNavigable({
      id: 'current',
      url: pageUrl,
      name: pageName
    } as any);
  }, []);

  return {
    navigateToMenu,
    openCreateModal,
    openEditModal,
    navigateToBase,
    closeModal,
    createCurrentPageNavigation
  };
}