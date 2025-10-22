import service from '@/utils/request'
import type {PageResult} from '@/types/common'
import type { SysUserDTO, SysUserQuery,SysUserVO} from '@/types/sys/user'

// 获取用户分页列表
export const getSysUserPageApi = (params: SysUserQuery) => {
  return service.get<PageResult<SysUserVO>>('/sys/user/page', { params })
}

// 获取用户详情
export const getSysUserInfoApi = (id: number) => {
  return service.get<SysUserVO>(`/sys/user/${id}`)
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
export const resetSysUserPasswordApi = (id: number) => {
  return service.put('/sys/user/password', { id:id, newPassword: '123456' })
}
