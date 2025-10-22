export interface SysConfig {
  id: string
  configKey: string
  configValue: string
  configType: string
  name: string
  remark?: string
  status: number
  createTime: string
  updateTime: string
  isSystem?: number
  type?: string
}

export interface SysConfigItem {
  id: string
  configKey: string
  configValue: string
  configType: string
  isSystem: number
  remark?: string
  createTime: string
}

export interface SysConfigQuery {
  configKey?: string
  name?: string
  configType?: string
  status?: number
  page?: number
  limit?: number
}

export interface SysConfigDTO extends SysConfig {}

export interface SysConfigVO extends SysConfig {}

export interface ConfigTypeOption {
  label: string
  value: string
  color?: string
}
