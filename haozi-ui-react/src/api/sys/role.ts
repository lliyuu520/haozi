import service from '@/utils/request'
import type {PageResult, SysMenu, SysRole, SysRoleDTO, SysRoleQuery} from '@/types/sys/role'

// 获取角色分页列表
export const getSysRolePageApi = (params: SysRoleQuery) => {
  return service.get<PageResult<SysRole>>('/sys/role/page', { params })
}

// 获取角色详情
export const getSysRoleInfoApi = (id: number) => {
  return service.get<SysRole>(`/sys/role/${id}`)
}

// 新增角色
export const createSysRoleApi = (data: SysRoleDTO) => {
  return service.post('/sys/role', data)
}

// 更新角色
export const updateSysRoleApi = (data: SysRoleDTO) => {
  return service.put('/sys/role', data)
}

// 删除角色
export const deleteSysRoleApi = (id: number) => {
  return service.delete(`/sys/role/${id}`)
}

// 修改角色状态
export const changeSysRoleStatusApi = (id: number, status: number) => {
  return service.put('/sys/role/status', { id, status })
}

// 获取角色列表（不分页）
export const getSysRoleListApi = (params?: SysRoleQuery) => {
  return service.get<SysRole[]>('/sys/role/list', { params })
}

// 获取角色菜单权限
export const getSysRoleMenuIdsApi = (id: number) => {
  return service.get<number[]>(`/sys/role/${id}/menus`)
}

// 保存角色菜单权限
export const saveSysRoleMenuIdsApi = (id: number, menuIds: number[]) => {
  return service.put(`/sys/role/${id}/menus`, { menuIds })
}

// 获取菜单树
export const getSysMenuTreeApi = () => {
  return service.get<SysMenu[]>('/sys/role/menu')
}