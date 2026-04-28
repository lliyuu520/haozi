import { api } from '@/utils/request';
import type { PageResult } from '@/types/page';

export type DictTypeRecord = {
  id: number;
  dictType: string;
  dictName: string;
  remark?: string | null;
};

export type DictDataRecord = {
  id: number;
  dictType: string;
  dictLabel: string;
  dictValue: string;
  weight: number;
  remark?: string | null;
};

export type DictTypeQuery = {
  dictType?: string;
  dictName?: string;
  page: number;
  pageSize: number;
};

export type DictDataQuery = {
  dictType: string;
  page: number;
  pageSize: number;
};

export type DictTypePayload = {
  dictType: string;
  dictName: string;
  remark?: string;
};

export type DictDataPayload = {
  dictType: string;
  dictLabel: string;
  dictValue: string;
  weight: number;
  remark?: string;
};

/**
 * 查询字典类型分页。
 *
 * @param query 查询条件和分页参数
 * @returns 字典类型分页数据
 */
export function listDictTypes(query: DictTypeQuery) {
  return api.get<PageResult<DictTypeRecord>>('/system/dicts/types', { params: query });
}

/**
 * 查询字典类型详情。
 *
 * @param id 字典类型 ID
 * @returns 字典类型详情
 */
export function getDictType(id: number) {
  return api.get<DictTypeRecord>(`/system/dicts/types/${id}`);
}

/**
 * 新增字典类型。
 *
 * @param payload 字典类型表单
 */
export function createDictType(payload: DictTypePayload) {
  return api.post<void, DictTypePayload>('/system/dicts/types', payload);
}

/**
 * 更新字典类型。
 *
 * @param id 字典类型 ID
 * @param payload 字典类型表单
 */
export function updateDictType(id: number, payload: DictTypePayload) {
  return api.put<void, DictTypePayload>(`/system/dicts/types/${id}`, payload);
}

/**
 * 删除字典类型。
 *
 * @param id 字典类型 ID
 */
export function deleteDictType(id: number) {
  return api.delete<void>(`/system/dicts/types/${id}`);
}

/**
 * 查询字典数据分页。
 *
 * @param query 查询条件和分页参数
 * @returns 字典数据分页数据
 */
export function listDictData(query: DictDataQuery) {
  return api.get<PageResult<DictDataRecord>>('/system/dicts/data', { params: query });
}

/**
 * 查询字典数据详情。
 *
 * @param id 字典数据 ID
 * @returns 字典数据详情
 */
export function getDictData(id: number) {
  return api.get<DictDataRecord>(`/system/dicts/data/${id}`);
}

/**
 * 新增字典数据。
 *
 * @param payload 字典数据表单
 */
export function createDictData(payload: DictDataPayload) {
  return api.post<void, DictDataPayload>('/system/dicts/data', payload);
}

/**
 * 更新字典数据。
 *
 * @param id 字典数据 ID
 * @param payload 字典数据表单
 */
export function updateDictData(id: number, payload: DictDataPayload) {
  return api.put<void, DictDataPayload>(`/system/dicts/data/${id}`, payload);
}

/**
 * 删除字典数据。
 *
 * @param id 字典数据 ID
 */
export function deleteDictData(id: number) {
  return api.delete<void>(`/system/dicts/data/${id}`);
}
