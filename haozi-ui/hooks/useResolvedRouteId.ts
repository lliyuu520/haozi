'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

/**
 * 根据 Next.js 路由参数解析实体 ID，并允许外部显式传入优先值。
 * @param paramKey 路由段中的参数名称（如 `[id]` → 'id'）
 * @param explicitId 可选的外部 ID（优先级最高）
 */
export function useResolvedRouteId<T extends string>(
  paramKey: string,
  explicitId?: T,
) {
  const params = useParams<Record<string, string | string[] | undefined>>();

  return useMemo(() => {
    if (explicitId !== undefined && explicitId !== null && explicitId !== '') {
      return explicitId;
    }

    const paramValue = params?.[paramKey];
    if (!paramValue) {
      return undefined;
    }

    return Array.isArray(paramValue) ? (paramValue[0] as T) : (paramValue as T);
  }, [explicitId, params, paramKey]);
}

export default useResolvedRouteId;
