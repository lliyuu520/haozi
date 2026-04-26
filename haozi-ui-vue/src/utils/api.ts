import service from './request'

export interface ApiOptions {
  baseUrl: string
  moduleName: string
}

export class BaseApi {
  private baseUrl: string
  private moduleName: string

  constructor(options: ApiOptions) {
    this.baseUrl = options.baseUrl
    this.moduleName = options.moduleName
  }

  // 获取详情
  getInfo(id: number) {
    return service.get(`${this.baseUrl}/info?id=${id}`)
  }

  // 提交数据（新增/修改）
  submit(data: any) {
    if (data.id) {
      return service.put(this.baseUrl, data)
    }
    return service.post(this.baseUrl, data)
  }

  // 删除数据
  delete(id: number) {
    return service.delete(`${this.baseUrl}/delete?id=${id}`)
  }

  // 获取列表
  getList(params?: any) {
    return service.get(`${this.baseUrl}/list`, { params })
  }

  // 分页查询
  getPage(params: any) {
    return service.get(`${this.baseUrl}/page`, { params })
  }
} 