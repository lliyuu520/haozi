import { api } from '@/utils/request';

export type CacheCommandStat = {
  name: string;
  value: number | string;
};

export type CacheInfo = {
  info?: Record<string, string | number | boolean | null>;
  keyCount?: number | string;
  commandStats?: CacheCommandStat[];
};

export type CacheValue = {
  cacheKey: string;
  cacheValue: unknown;
};

/**
 * 查询 Redis 运行信息、Key 数量和命令统计。
 *
 * @returns Redis 监控数据
 */
export function getCacheInfo() {
  return api.get<CacheInfo>('/monitor/cache/info');
}

/**
 * 查询所有缓存 Key。
 *
 * @returns 缓存 Key 列表
 */
export function listCacheKeys() {
  return api.get<string[]>('/monitor/cache/getCacheKeys');
}

/**
 * 查询指定缓存 Key 的值。
 *
 * @param cacheKey 缓存 Key
 * @returns 缓存值
 */
export function getCacheValue(cacheKey: string) {
  return api.get<CacheValue>(`/monitor/cache/getCacheValue/${encodeURIComponent(cacheKey)}`);
}

/**
 * 删除指定缓存 Key。
 *
 * @param cacheKey 缓存 Key
 */
export function deleteCacheKey(cacheKey: string) {
  return api.delete<void>(`/monitor/cache/delCacheKey/${encodeURIComponent(cacheKey)}`);
}

/**
 * 删除全部缓存。
 */
export function deleteAllCache() {
  return api.delete<void>('/monitor/cache/delCacheAll');
}
