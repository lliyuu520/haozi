import { request } from '@/lib/api';
import { withErrorHandling } from '@/lib/apiUtils';
import { RouteHelper } from '@/utils/routeHelper';
import {
  MenuItem,
  RawMenuNode,
  MenuType,
  OpenStyle,
  MenuUtils
} from '@/types/menu';

// 重新导出类型和枚举，方便其他模块使用
export { MenuType, OpenStyle };

// 菜单树节点（使用统一的 MenuItem 类型）
export type MenuTreeNode = MenuItem;

// 菜单详情（包含父级名称）
export interface MenuDetail extends MenuTreeNode {
  parentName?: string;
}

// 菜单创建参数
export interface MenuCreateParams {
  parentId: string;         // 改为字符串类型
  name: string;
  url?: string;
  perms?: string;
  type: MenuType;
  openStyle: OpenStyle;
  icon?: string;
  weight: number;
  hidden?: number;
  meta?: {
    deeplink?: boolean;
    keepAlive?: boolean;
    modal?: {
      present?: string;
      width?: number;
    };
  };
}

// 菜单更新参数
export interface MenuUpdateParams extends MenuCreateParams {
  id: string;              // 改为字符串类型
}

// 查询参数
export interface MenuQueryParams {
  type?: MenuType;
}

// 菜单导航信息
export interface MenuNavigation {
  href: string;
  basePath: string;
  modal: {
    create: string;
    edit: (id: string) => string;
  };
  breadcrumbs: string[];
  modulePath: string;
}

// 扩展 MenuItem 类型，添加导航方法
export interface NavigableMenuItem extends MenuItem {
  getNavigation: () => MenuNavigation;
  getRoute: () => string;
  getModalRoute: (action: string, id?: string) => string;
  getBasePath: () => string;
}

// 获取菜单列表
export function getMenuList(params?: MenuQueryParams) {
  return request.get<{
    data: MenuItem[];
  }>('/sys/menu/list', { params }).then(response => {
    return {
      ...response,
      data: response.data?.data || [],
    };
  });
}

// 获取菜单详情
export function getMenuDetail(id: string) {
  return request.get<{
    data: MenuItem & { parentName?: string };
  }>(`/sys/menu/${id}`).then(response => {
    const data = response.data?.data || {};
    return {
      ...response,
      data: {
        ...data,
        // 设置默认值
        hidden: data.hidden ?? 0,
        meta: data.meta || {
          deeplink: false,
          keepAlive: false,
          modal: {
            present: 'default',
            width: 680,
          },
        },
        // 同步 hidden 字段到 meta
        meta: {
          ...data.meta,
          hidden: data.hidden === 1,
        },
      } as MenuDetail,
    };
  });
}

// 创建菜单
export function createMenu(data: MenuCreateParams) {
  // 构造后端数据格式
  const backendData = {
    parentId: data.parentId,
    name: data.name,
    url: data.url, // 直接使用，前端输入的应该是后端格式
    perms: data.perms || '',
    type: data.type,
    openStyle: data.openStyle,
    icon: data.icon || '',
    weight: data.weight,
    hidden: data.hidden ?? 0, // 默认为显示
    meta: {
      ...data.meta,
      hidden: data.hidden === 1, // 同步到 meta 配置
    },
  };

  return withErrorHandling(
    request.post('/sys/menu', backendData),
    '创建菜单'
  );
}

// 更新菜单
export function updateMenu(data: MenuUpdateParams) {
  // 构造后端数据格式
  const backendData = {
    id: data.id,
    parentId: data.parentId,
    name: data.name,
    url: data.url, // 直接使用，前端输入的应该是后端格式
    perms: data.perms || '',
    type: data.type,
    openStyle: data.openStyle,
    icon: data.icon || '',
    weight: data.weight,
    hidden: data.hidden ?? 0, // 默认为显示
    meta: {
      ...data.meta,
      hidden: data.hidden === 1, // 同步到 meta 配置
    },
  };

  return withErrorHandling(
    request.put('/sys/menu', backendData),
    '更新菜单'
  );
}

// 删除菜单
export function deleteMenu(id: string) {
  return withErrorHandling(
    request.delete('/sys/menu', { params: { id } }),
    '删除菜单'
  );
}

// 菜单导航工具函数
export class MenuNavigationHelper {
  /**
   * 将 MenuItem 转换为 NavigableMenuItem，添加导航方法
   * @param menu 菜单项
   * @returns 可导航的菜单项
   */
  static makeNavigable(menu: MenuItem): NavigableMenuItem {
    return {
      ...menu,
      getNavigation: () => RouteHelper.createMenuNavigation(menu.url || ''),
      getRoute: () => RouteHelper.generateRoute(menu.url || ''),
      getModalRoute: (action: string, id?: string) =>
        RouteHelper.generateModalRoute(menu.url || '', action, id),
      getBasePath: () => RouteHelper.generateBasePath(menu.url || '')
    };
  }

  /**
   * 批量转换菜单项为可导航菜单项
   * @param menus 菜单项数组
   * @returns 可导航菜单项数组
   */
  static makeMenusNavigable(menus: MenuItem[]): NavigableMenuItem[] {
    return menus.map(menu => this.makeNavigable(menu));
  }

  /**
   * 验证并标准化菜单URL
   * @param url 原始URL
   * @returns 标准化后的URL
   */
  static normalizeMenuUrl(url?: string): string {
    if (!url) return '';

    // 如果不是React风格URL，进行转换
    if (url.startsWith('/')) {
      url = url.slice(1); // 移除开头的斜杠
    }

    // 如果不是页面路由且不是模态框路由，添加/page后缀
    if (!url.endsWith('/page') && !url.includes('/modal/') && url && !url.includes('http')) {
      url = RouteHelper.normalizeUrl(url);
    }

    return url;
  }

  /**
   * 验证菜单URL格式
   * @param url URL字符串
   * @returns 验证结果
   */
  static validateMenuUrl(url?: string): { isValid: boolean; message?: string } {
    if (!url) {
      return { isValid: false, message: 'URL不能为空' };
    }

    // 外部链接不验证
    if (url.startsWith('http')) {
      return { isValid: true };
    }

    // 验证React风格URL
    const normalized = this.normalizeMenuUrl(url);
    if (!RouteHelper.isValidReactUrl(normalized) && !normalized.includes('/modal/')) {
      return {
        isValid: false,
        message: 'URL格式不正确，应为 "module/submodule/page" 格式'
      };
    }

    return { isValid: true };
  }
}

// 获取菜单列表（增强版，返回可导航菜单）
export function getMenuListNavigable(params?: MenuQueryParams) {
  return getMenuList(params).then(response => {
    return {
      ...response,
      data: MenuNavigationHelper.makeMenusNavigable(response.data)
    };
  });
}

// 创建菜单（增强版，自动处理URL格式）
export function createMenuWithNavigation(data: MenuCreateParams) {
  // 标准化URL格式
  const normalizedData = {
    ...data,
    url: MenuNavigationHelper.normalizeMenuUrl(data.url)
  };

  return createMenu(normalizedData);
}

// 更新菜单（增强版，自动处理URL格式）
export function updateMenuWithNavigation(data: MenuUpdateParams) {
  // 标准化URL格式
  const normalizedData = {
    ...data,
    url: MenuNavigationHelper.normalizeMenuUrl(data.url)
  };

  return updateMenu(normalizedData);
}

