import service from '@/utils/request'
import type {PageResult, SysUser, SysUserDTO, SysUserPasswordDTO, SysUserQuery} from '@/types/sys/user'

// 获取用户分页列表
export const getSysUserPageApi = (params: SysUserQuery) => {
  return service.get<PageResult<SysUser>>('/sys/user/page', { params })
}

// 获取用户详情
export const getSysUserInfoApi = (id: string) => {
  return service.get<SysUser>(`/sys/user/${id}`)
}

// 获取当前用户信息
export const getCurrentUserInfoApi = () => {
  return service.get<SysUser>('/sys/user/info')
}

// 新增用户
export const createSysUserApi = (data: SysUserDTO) => {
  return service.post('/sys/user', data)
}

// 更新用户
export const updateSysUserApi = (data: SysUserDTO) => {
  return service.put('/sys/user', data)
}

// 删除用户
export const deleteSysUserApi = (id: string) => {
  return service.delete('/sys/user', { params: { id } })
}

// 修改用户状态
export const changeSysUserStatusApi = (id: string, status: number) => {
  return service.put('/sys/user/status', { id, status })
}

// 重置用户密码（管理员重置用户密码）
export const resetSysUserPasswordApi = (id: string) => {
  return service.put('/sys/user/password', { id, newPassword: '123456' })
}

// 修改当前用户密码
export const updateUserPasswordApi = (data: SysUserPasswordDTO) => {
  return service.put('/sys/user/password', data)
}

// 获取用户列表（不分页）
export const getSysUserListApi = (params?: SysUserQuery) => {
  return service.get<SysUser[]>('/sys/user/list', { params })
}

// 获取用户角色列表
export const getSysUserRoleIdsApi = (id: string) => {
  return service.get<string[]>('/sys/user/role/ids', { params: { id } })
}

// 保存用户角色
export const saveSysUserRoleIdsApi = (id: string, roleIds: string[]) => {
  return service.put('/sys/user/role/ids', { id, roleIds })
}