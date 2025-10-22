export interface DictTypeItem {
  id: string
  dictName: string
  dictType: string
  status: number
  remark?: string
  createTime: string
}

export interface DictDataItem {
  id: string
  dictType: string
  dictLabel: string
  dictValue: string
  dictSort: number
  status: number
  remark?: string
  createTime: string
}

export interface DictItem {
  dictType: string
  dictName: string
  dataList: DictDataItem[]
}
