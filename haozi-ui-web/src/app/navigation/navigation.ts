import { routeManifest } from '@/app/route-manifest/routes';
import type { AppRouteMeta } from '@/app/route-manifest/types';
import type { NavigationMenuNode } from '@/app/navigation/api';

export type NavigationRoute = {
  key: string;
  path?: string;
  title: string;
  icon?: string;
  order: number;
  children: NavigationRoute[];
};

const routeByPath = new Map(routeManifest.map(route => [route.path, route]));

/**
 * 将后端菜单树转换为前端侧栏可消费的导航节点。
 *
 * 后端只决定展示树、标题、图标和排序，实际可加载页面仍必须命中 route manifest。
 */
export function buildNavigationRoutes(nodes: NavigationMenuNode[]) {
  return nodes
    .map(toNavigationRoute)
    .filter((item): item is NavigationRoute => item !== null)
    .sort(sortNavigationRoute);
}

/**
 * 根据当前路径从动态导航树中查找页面节点。
 *
 * @param routes 导航树
 * @param path 当前路由路径
 * @returns 匹配的导航节点
 */
export function findNavigationRouteByPath(routes: NavigationRoute[], path: string): NavigationRoute | undefined {
  for (const route of routes) {
    if (route.path === path) {
      return route;
    }
    const child = findNavigationRouteByPath(route.children, path);
    if (child) {
      return child;
    }
  }
  return undefined;
}

/**
 * 根据当前路径查找导航树中的父级菜单 key。
 *
 * @param routes 导航树
 * @param path 当前路由路径
 * @returns 当前路径的父级菜单 key 列表
 */
export function findNavigationAncestorKeys(routes: NavigationRoute[], path: string): string[] {
  for (const route of routes) {
    if (route.path === path) {
      return [];
    }

    const childKeys = findNavigationAncestorKeys(route.children, path);
    if (childKeys.length > 0 || route.children.some(child => child.path === path)) {
      return [route.key, ...childKeys];
    }
  }
  return [];
}

/**
 * 获取动态导航树中的第一个可访问页面路径。
 *
 * @param routes 导航树
 * @returns 第一个可访问页面路径
 */
export function getFirstNavigationPath(routes: NavigationRoute[]): string | undefined {
  for (const route of routes) {
    if (route.path) {
      return route.path;
    }
    const childPath = getFirstNavigationPath(route.children);
    if (childPath) {
      return childPath;
    }
  }
  return undefined;
}

function toNavigationRoute(node: NavigationMenuNode): NavigationRoute | null {
  const route = resolveRoute(node);
  const children = (node.children ?? [])
    .map(toNavigationRoute)
    .filter((item): item is NavigationRoute => item !== null)
    .sort(sortNavigationRoute);

  if ((!route || route.hideInMenu) && children.length === 0) {
    return null;
  }

  return {
    key: route?.path ?? `menu-${node.id}`,
    path: route?.path,
    title: node.name || route?.title || '',
    icon: node.icon || route?.icon,
    order: node.weight ?? route?.order ?? 0,
    children,
  };
}

function resolveRoute(node: NavigationMenuNode): AppRouteMeta | undefined {
  const path = normalizeRoutePath(node.url);
  return path ? routeByPath.get(path) : undefined;
}

function normalizeRoutePath(url: string) {
  const value = url.trim();
  if (!value || isExternalUrl(value) || !value.startsWith('/')) {
    return undefined;
  }
  return value;
}

function isExternalUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function sortNavigationRoute(left: NavigationRoute, right: NavigationRoute) {
  return left.order - right.order;
}
