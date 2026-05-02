import { api } from '@/utils/request';
import type { PageResult } from '@/types/page';

export type ConfigType = 'SWITCH_TYPE' | 'TEXT_TYPE' | 'NUMBER_TYPE' | 'FILE_TYPE' | 'IMAGE_TYPE';

export type ConfigFile = {
  name: string;
  url: string;
};

export type ConfigRecord = {
  id: number;
  code: string;
  descs?: string | null;
  type: ConfigType;
  enabled?: boolean | null;
  num?: number | null;
  text?: string | null;
  files?: ConfigFile[] | null;
  images?: ConfigFile[] | null;
};

export type ConfigQuery = {
  code?: string;
  descs?: string;
  type?: ConfigType;
  page: number;
  pageSize: number;
};

export type ConfigPayload = {
  code: string;
  descs?: string;
  type: ConfigType;
  enabled?: boolean;
  num?: number;
  text?: string;
  files?: ConfigFile[];
  images?: ConfigFile[];
};

/**
 * 查询参数配置分页。
 *
 * @param query 查询条件和分页参数
 * @returns 参数配置分页数据
 */
export function listConfigs(query: ConfigQuery) {
  return api.get<PageResult<ConfigRecord>>('/system/configs', { params: query });
}

/**
 * 查询参数配置详情。
 *
 * @param id 参数 ID
 * @returns 参数配置详情
 */
export function getConfig(id: number) {
  return api.get<ConfigRecord>(`/system/configs/${id}`);
}

/**
 * 新增参数配置。
 *
 * @param payload 参数配置表单
 */
export function createConfig(payload: ConfigPayload) {
  return api.post<void, ConfigPayload>('/system/configs', payload);
}

/**
 * 更新参数配置。
 *
 * @param id 参数 ID
 * @param payload 参数配置表单
 */
export function updateConfig(id: number, payload: ConfigPayload) {
  return api.put<void, ConfigPayload>(`/system/configs/${id}`, payload);
}

/**
 * 删除参数配置。
 *
 * @param id 参数 ID
 */
export function deleteConfig(id: number) {
  return api.delete<void>(`/system/configs/${id}`);
}
