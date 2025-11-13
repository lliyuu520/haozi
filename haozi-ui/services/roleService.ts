import {request} from '@/lib/api';
import {API} from '@/lib/apiEndpoints';
import type {Role, RoleCreateParams, RolePageResponse, RoleQueryParams, RoleUpdateParams,} from '@/types/role';

/**
 * 获取角色列表（分页）
 */
export async function getRolePage(params: RoleQueryParams = {}): Promise<RolePageResponse> {
    const response = await request.get<{
        list?: Role[];
        total?: number;
        current?: number;
        pageSize?: number;
    }>(API.role.page(), params as Record<string, unknown>);

    const payload = response.data?.data ?? {};
    const list = Array.isArray(payload.list) ? payload.list : [];
    const total = typeof payload.total === 'number' ? payload.total : list.length;
    const pageSize = typeof payload.pageSize === 'number' ? payload.pageSize : list.length || 20;
    const current = typeof payload.current === 'number' ? payload.current : 1;

    return {
        list,
        total,
        current,
        pageSize,
    };
}

/**
 * 获取角色列表（不分页）
 */
export async function getRoleList(params: RoleQueryParams = {}): Promise<Role[]> {
    const response = await request.get<Role[]>(API.role.list(), params as Record<string, unknown>);
    return response.data?.data ?? [];
}

/**
 * 获取角色详情
 */
export async function getRoleDetail(id: string): Promise<Role | null> {
    const response = await request.get<Role>(API.role.detail(id));
    return response.data?.data ?? null;
}

/**
 * 创建角色
 */
export async function createRole(params: RoleCreateParams): Promise<void> {
    await request.post(API.role.create(), params);
}

/**
 * 更新角色
 */
export async function updateRole(params: RoleUpdateParams): Promise<void> {
    await request.put(API.role.update(), params);
}

/**
 * 删除角色
 */
export async function deleteRole(id: string): Promise<void> {
    await request.delete(API.role.delete(id));
}

/**
 * 获取角色菜单树
 */
export async function getRoleMenuTree(): Promise<unknown> {
    const response = await request.get(API.role.menu());
    return response.data?.data ?? [];
}
