import service from '@/utils/request'
import type {DictDataItem, DictItem, DictTypeItem} from '@/types/sys/dict'

// 字典类型相关接口
export const dictTypeApi = {
  // 获取字典类型分页列表
  getPage: (params?: any) => {
    return service.get('/sys/dict/type/page', { params })
  },

  // 获取字典类型详情
  getInfo: (id: string) => {
    return service.get<DictTypeItem>(`/sys/dict/type/${id}`)
  },

  // 保存字典类型
  save: (data: DictTypeItem) => {
    if (data.id) {
      return service.put('/sys/dict/type', data)
    } else {
      return service.post('/sys/dict/type', data)
    }
  },

  // 删除字典类型
  delete: (id: string) => {
    return service.delete('/sys/dict/type', { data: { id } })
  }
}

// 字典数据相关接口
export const dictDataApi = {
  // 获取字典数据分页列表
  getPage: (params?: any) => {
    return service.get('/sys/dict/data/page', { params })
  },

  // 根据字典类型获取字典数据
  getByType: (dictType: string) => {
    return service.get<DictDataItem[]>(`/sys/dict/data/listDataByType`, {
      params: { dictType }
    })
  },

  // 获取字典数据详情
  getInfo: (id: string) => {
    return service.get<DictDataItem>('/sys/dict/data/info', { params: { id } })
  },

  // 保存字典数据
  save: (data: DictDataItem) => {
    if (data.id) {
      return service.put('/sys/dict/data', data)
    } else {
      return service.post('/sys/dict/data', data)
    }
  },

  // 删除字典数据
  delete: (id: string) => {
    return service.delete('/sys/dict/data', { data: { id } })
  }
}

// 字典完整数据接口
export const dictApi = {
  // 获取所有字典数据（类型+数据）
  getAll: () => {
    return service.get<DictItem[]>('/sys/dict/type/all')
  }
}
