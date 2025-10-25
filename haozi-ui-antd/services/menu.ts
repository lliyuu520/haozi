import { request } from '@/lib/api';

// 菜单类型枚举
export enum MenuType {
  MENU = 0,      // 菜单
  BUTTON = 1,   // 按钮
  INTERFACE = 2, // 接口
}

// 打开方式枚举
export enum OpenStyle {
  INTERNAL = 0,  // 内部打开
  EXTERNAL = 1,  // 外部打开
}

// 菜单树节点
export interface MenuTreeNode {
  id: number;
  parentId: number;
  name: string;
  url?: string;
  perms?: string;
  type: MenuType;
  openStyle: OpenStyle;
  weight: number;
  children?: MenuTreeNode[];
  createTime?: string;
  updateTime?: string;
}

// 菜单详情
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
    data: MenuTreeNode[];
  }>('/sys/menu/list', { params });
}

// 获取菜单详情
export function getMenuDetail(id: number) {
  return request.get<{
    data: MenuDetail;
  }>(`/sys/menu/${id}`);
}

// 创建菜单
export function createMenu(data: MenuCreateParams) {
  return request.post('/sys/menu', data);
}

// 更新菜单
export function updateMenu(data: MenuUpdateParams) {
  return request.put('/sys/menu', data);
}

// 删除菜单
export function deleteMenu(id: number) {
  return request.delete('/sys/menu', { params: { id } });
}