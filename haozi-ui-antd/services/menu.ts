import { request } from '@/lib/api';
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
  parentId: number;
  name: string;
  url?: string;
  perms?: string;
  type: MenuType;
  openStyle: OpenStyle;
  icon?: string;
  weight: number;
}

// 菜单更新参数
export interface MenuUpdateParams extends MenuCreateParams {
  id: number;
}

// 查询参数
export interface MenuQueryParams {
  type?: MenuType;
}

// 获取菜单列表
export function getMenuList(params?: MenuQueryParams) {
  return request.get<{
    data: RawMenuNode[];
  }>('/sys/menu/list', { params }).then(response => {
    // 转换后端数据为前端MenuItem格式
    return {
      ...response,
      data: MenuUtils.transformRawMenus(response.data?.data || []),
    };
  });
}

// 获取菜单详情
export function getMenuDetail(id: number) {
  return request.get<{
    data: RawMenuNode & { parentName?: string };
  }>(`/sys/menu/${id}`).then(response => {
    // 转换后端数据为前端MenuItem格式
    const transformedData = MenuUtils.transformRawMenu(response.data?.data || {});
    return {
      ...response,
      data: {
        ...transformedData,
        parentName: response.data?.data?.parentName,
      } as MenuDetail,
    };
  });
}

// 创建菜单
export function createMenu(data: MenuCreateParams) {
  // 将前端数据转换为后端格式
  const rawMenu: MenuItem = {
    id: 0, // 创建时ID由后端生成
    parentId: data.parentId,
    name: data.name,
    url: data.url,
    perms: data.perms,
    type: data.type,
    openStyle: data.openStyle,
    icon: data.icon,
    weight: data.weight,
    // 设置默认值
    visible: true,
    meta: {
      title: data.name,
      icon: data.icon,
      permission: data.perms ? data.perms.split(',').filter(p => p.trim()) : [],
      target: data.openStyle === OpenStyle.EXTERNAL ? '_blank' : '_self',
    },
  };

  const backendData = MenuUtils.menuItemToRaw(rawMenu);
  return request.post('/sys/menu', backendData);
}

// 更新菜单
export function updateMenu(data: MenuUpdateParams) {
  // 将前端数据转换为后端格式
  const rawMenu: MenuItem = {
    id: data.id,
    parentId: data.parentId,
    name: data.name,
    url: data.url,
    perms: data.perms,
    type: data.type,
    openStyle: data.openStyle,
    icon: data.icon,
    weight: data.weight,
    meta: {
      title: data.name,
      icon: data.icon,
      permission: data.perms ? data.perms.split(',').filter(p => p.trim()) : [],
      target: data.openStyle === OpenStyle.EXTERNAL ? '_blank' : '_self',
    },
  };

  const backendData = MenuUtils.menuItemToRaw(rawMenu);
  return request.put('/sys/menu', backendData);
}

// 删除菜单
export function deleteMenu(id: number) {
  return request.delete('/sys/menu', { params: { id } });
}
