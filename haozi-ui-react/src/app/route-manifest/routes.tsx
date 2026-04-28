import { lazy } from 'react';
import type { AppRouteMeta } from '@/app/route-manifest/types';

export const routeManifest: AppRouteMeta[] = [
  {
    code: 'dashboard.home',
    path: '/dashboard',
    title: '仪表盘',
    icon: 'DashboardOutlined',
    order: 10,
    component: lazy(() => import('@/features/dashboard/DashboardPage')),
  },
  {
    code: 'sys.user',
    path: '/system/users',
    title: '用户管理',
    icon: 'UserOutlined',
    order: 100,
    component: lazy(() => import('@/features/system/users/UserPage')),
  },
  {
    code: 'sys.role',
    path: '/system/roles',
    title: '角色管理',
    icon: 'SafetyCertificateOutlined',
    order: 110,
    component: lazy(() => import('@/features/system/roles/RolePage')),
  },
  {
    code: 'sys.menu',
    path: '/system/menus',
    title: '菜单资源',
    icon: 'ApartmentOutlined',
    order: 120,
    component: lazy(() => import('@/features/system/menus/MenuPage')),
  },
  {
    code: 'sys.dict',
    path: '/system/dicts',
    title: '字典管理',
    icon: 'BookOutlined',
    order: 130,
    component: lazy(() => import('@/features/system/dicts/DictPage')),
  },
  {
    code: 'sys.config',
    path: '/system/configs',
    title: '参数配置',
    icon: 'ControlOutlined',
    order: 140,
    component: lazy(() => import('@/features/system/PlaceholderPage')),
  },
  {
    code: 'monitor.server',
    path: '/monitor/server',
    title: '服务器监控',
    icon: 'MonitorOutlined',
    order: 200,
    component: lazy(() => import('@/features/system/PlaceholderPage')),
  },
  {
    code: 'monitor.cache',
    path: '/monitor/cache',
    title: '缓存监控',
    icon: 'DatabaseOutlined',
    order: 210,
    component: lazy(() => import('@/features/system/PlaceholderPage')),
  },
];
