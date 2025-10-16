import service from '@/utils/request'
import type {ChannelDealer, ChannelDealerDTO, ChannelDealerQuery, PageResult} from '@/types/channel'

// 获取经销商分页列表
export const getChannelDealerPageApi = (params: ChannelDealerQuery) => {
  return service.get<PageResult<ChannelDealer>>('/channel/dealer/page', { params })
}

// 获取经销商详情
export const getChannelDealerInfoApi = (id: string) => {
  return service.get<ChannelDealer>(`/channel/dealer/info`, { params: { id } })
}

// 新增经销商
export const createChannelDealerApi = (data: ChannelDealerDTO) => {
  return service.post('/channel/dealer', data)
}

// 更新经销商
export const updateChannelDealerApi = (data: ChannelDealerDTO) => {
  return service.put('/channel/dealer', data)
}

// 删除经销商
export const deleteChannelDealerApi = (id: string) => {
  return service.delete(`/channel/dealer?id=${id}`)
}

// 修改经销商状态
export const changeChannelDealerEnabledApi = (id: string) => {
  return service.put(`/channel/dealer/enabled`, { id })
}

// 获取经销商列表（不分页）
export const getChannelDealerListApi = (params?: ChannelDealerQuery) => {
  return service.get<ChannelDealer[]>('/channel/dealer/list', { params })
}