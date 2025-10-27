'use client';

import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import { RouteHelper } from '@/utils/routeHelper';

interface BreadcrumbItem {
  title: React.ReactNode;
  href?: string;
}

interface DynamicBreadcrumbProps {
  /** 自定义首页标题 */
  homeTitle?: React.ReactNode;
  /** 额外的面包屑项 */
  extraItems?: BreadcrumbItem[];
  /** 自定义路径解析函数 */
  customParser?: (path: string) => BreadcrumbItem[];
  /** 是否显示首页图标 */
  showHomeIcon?: boolean;
}

/**
 * 动态面包屑组件
 * 根据当前路径自动生成面包屑导航
 */
export function DynamicBreadcrumb({
  homeTitle = '首页',
  extraItems = [],
  customParser,
  showHomeIcon = true
}: DynamicBreadcrumbProps) {
  const pathname = usePathname();

  // 生成面包屑项
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    let items: BreadcrumbItem[] = [];

    // 首页
    items.push({
      title: showHomeIcon ? <HomeOutlined /> : homeTitle,
      href: '/'
    });

    if (pathname === '/') {
      return items;
    }

    // 使用自定义解析器或默认解析器
    if (customParser) {
      const customItems = customParser(pathname);
      items = items.concat(customItems);
    } else {
      // 默认解析逻辑：将路径转换为面包屑
      const pathSegments = pathname.split('/').filter(Boolean);

      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        // 跳过模态框路径
        if (segment === 'modal') return;

        // 生成标题
        let title = segment;

        // 转换常见的路径名称
        const nameMap: Record<string, string> = {
          'system': '系统管理',
          'menu': '菜单管理',
          'user': '用户管理',
          'role': '角色管理',
          'dashboard': '仪表板',
          'profile': '个人中心',
          'settings': '系统设置'
        };

        title = nameMap[segment] || segment;

        // 如果是最后一项且是页面路径，添加"页面"后缀
        if (index === pathSegments.length - 1 && RouteHelper.isPageRoute(segment)) {
          title = title.replace('page', '页面');
        }

        items.push({
          title: title,
          href: currentPath
        });
      });
    }

    // 添加额外项
    if (extraItems.length > 0) {
      items = items.concat(extraItems);
    }

    return items;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <Breadcrumb
      items={breadcrumbItems.map((item, index) => ({
        key: index,
        title: item.title,
        ...(item.href && index < breadcrumbItems.length - 1 && {
          href: item.href
        })
      }))}
    />
  );
}

/**
 * 基于菜单URL的面包屑组件
 */
export function MenuBreadcrumb({
  menuUrl,
  homeTitle = '首页',
  showHomeIcon = true
}: {
  menuUrl: string;
  homeTitle?: React.ReactNode;
  showHomeIcon?: boolean;
}) {
  const customParser = (path: string): BreadcrumbItem[] => {
    // 从菜单URL生成面包屑
    const breadcrumbs = RouteHelper.parseBreadcrumbs(menuUrl);

    return breadcrumbs.map((segment, index) => {
      let currentPath = '';
      for (let i = 0; i <= index; i++) {
        currentPath += `/${breadcrumbs[i]}`;
      }

      // 名称映射
      const nameMap: Record<string, string> = {
        'system': '系统管理',
        'menu': '菜单管理',
        'user': '用户管理',
        'role': '角色管理',
        'dashboard': '仪表板'
      };

      const title = nameMap[segment] || segment;

      return {
        title,
        href: index < breadcrumbs.length - 1 ? currentPath + '/page' : undefined
      };
    });
  };

  return (
    <DynamicBreadcrumb
      homeTitle={homeTitle}
      showHomeIcon={showHomeIcon}
      customParser={customParser}
    />
  );
}