import service from '@/utils/request'
import type {DictDataItem, DictItem, DictTypeItem} from '@/types/sys/dict'
import type {MenuTreeItem} from '@/types/sys/menu'
import type {SysConfigItem} from '@/types/sys/config'

// 获取完整字典数据（类型+数据）
export const getDictListApi = () => {
  return service.get<DictItem[]>('/sys/dict/type/all')
}

// 获取字典类型列表
export const getDictTypeListApi = (params?: any) => {
  return service.get('/sys/dict/type/page', { params })
}

// 获取字典类型详情
export const getDictTypeInfoApi = (id: string) => {
  return service.get<DictTypeItem>(`/sys/dict/type/${id}`)
}

// 保存字典类型
export const saveDictTypeApi = (data: DictTypeItem) => {
  if (data.id) {
    return service.put('/sys/dict/type', data)
  } else {
    return service.post('/sys/dict/type', data)
  }
}

// 删除字典类型
export const deleteDictTypeApi = (id: string) => {
  return service.delete('/sys/dict/type', { data: { id } })
}

// 获取字典数据列表
export const getDictDataListApi = (params?: any) => {
  return service.get('/sys/dict/data/page', { params })
}

// 根据字典类型获取字典数据
export const getDictDataByTypeApi = (dictType: string) => {
  return service.get<DictDataItem[]>(`/sys/dict/data/listDataByType`, { params: { dictType } })
}

// 获取字典数据详情
export const getDictDataInfoApi = (id: string) => {
  return service.get<DictDataItem>('/sys/dict/data/info', { params: { id } })
}

// 保存字典数据
export const saveDictDataApi = (data: DictDataItem) => {
  if (data.id) {
    return service.put('/sys/dict/data', data)
  } else {
    return service.post('/sys/dict/data', data)
  }
}

// 删除字典数据
export const deleteDictDataApi = (id: string) => {
  return service.delete('/sys/dict/data', { data: { id } })
}

// 获取系统配置列表
export const getSysConfigListApi = () => {
  return service.get<SysConfigItem[]>('/sys/config/list')
}

// 获取菜单树
export const getMenuTreeApi = () => {
  return service.get<MenuTreeItem[]>('/sys/menu/tree')
}

// 获取用户列表
export const getUserListApi = (params: any) => {
  return service.get('/sys/user/page', { params })
}

// 获取角色列表
export const getRoleListApi = (params: any) => {
  return service.get('/sys/role/page', { params })
}

// 获取菜单列表
export const getMenuListApi = (params: any) => {
  return service.get('/sys/menu/page', { params })
}

// 获取配置列表
export const getConfigListApi = (params: any) => {
  return service.get('/sys/config/page', { params })
}
