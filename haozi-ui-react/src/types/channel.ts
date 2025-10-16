export interface ChannelDealer {
  id: string
  code: string
  name: string
  phone: string
  email?: string
  address?: string
  enabled: boolean
  maOpenid?: string
  maNickname?: string
  createTime: string
  updateTime: string
  statusText: string
  bindText: string
}

export interface ChannelDealerQuery {
  code?: string
  name?: string
  phone?: string
  enabled?: boolean
  page?: number
  limit?: number
}

export interface ChannelDealerDTO {
  id?: string
  code: string
  name: string
  phone: string
  email?: string
  address?: string
  enabled: boolean
}

export interface ChannelDealerVO extends ChannelDealer {
  // 可以添加额外的展示字段
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  limit: number
}