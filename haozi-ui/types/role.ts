
// 角色接口，匹配后端 SysRoleVO
export interface Role {
  id: string;
  name: string;
  menuIdList?: string[]; // 菜单ID列表
}

// 角色表单值类型，匹配后端 SysRoleDTO
export interface RoleFormValues {
  name: string;
  menuIdList?: string[]; // 选择的菜单ID列表
}

// 角色创建参数，匹配后端 SysRoleDTO
export interface RoleCreateParams {
  name: string;
  menuIdList?: string[];
}

// 角色更新参数，匹配后端 SysRoleDTO
export interface RoleUpdateParams extends RoleCreateParams {
  id: string;
}

// 角色查询参数，匹配后端 SysRoleQuery
export interface RoleQueryParams {
  name?: string;
  current?: number;
  pageSize?: number;
}

// 角色分页响应，匹配后端 PageVO
export interface RolePageResponse {
  list: Role[];
  total: number;
  current: number;
  pageSize: number;
}

// 菜单权限树节点
export interface MenuPermissionNode {
  id: string;
  name: string;
  key: string;
  title: string;
  children?: MenuPermissionNode[];
  disableCheckbox?: boolean;
  disable?: boolean;
  checkable?: boolean;
}






