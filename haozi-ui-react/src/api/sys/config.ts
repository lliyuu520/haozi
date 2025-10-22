import service from '@/utils/request'
import type {PageResult} from '@/types/common'
import type {SysConfig, SysConfigDTO, SysConfigQuery} from '@/types/sys/config'

// 获取系统配置分页列表
export const getSysConfigPageApi = (params: SysConfigQuery) => {
  return service.get<PageResult<SysConfig>>('/sys/config/page', { params })
}

// 获取系统配置详情
export const getSysConfigInfoApi = (id: string) => {
  return service.get<SysConfig>('/sys/config/info', { params: { id } })
}

// 获取系统配置详情通过key
export const getSysConfigByKeyApi = (configKey: string) => {
  return service.get<SysConfig>('/sys/config/key', { params: { configKey } })
}

// 新增系统配置
export const createSysConfigApi = (data: SysConfigDTO) => {
  return service.post('/sys/config', data)
}

// 更新系统配置
export const updateSysConfigApi = (data: SysConfigDTO) => {
  return service.put('/sys/config', data)
}

// 删除系统配置
export const deleteSysConfigApi = (id: string) => {
  return service.delete(`/sys/config?id=${id}`)
}

// 修改系统配置状态
export const changeSysConfigStatusApi = (id: string, status: number) => {
  return service.put('/sys/config/status', { id, status })
}

// 获取系统配置列表（不分页）
export const getSysConfigListApi = (params?: SysConfigQuery) => {
  return service.get<SysConfig[]>('/sys/config/list', { params })
}

// 刷新系统配置缓存
export const refreshSysConfigCacheApi = () => {
  return service.post('/sys/config/refresh')
}
