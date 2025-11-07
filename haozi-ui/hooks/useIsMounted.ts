import { useState, useEffect } from 'react';

/**
 * 自定义 Hook，用于检测组件是否已在客户端挂载
 * 解决 Next.js SSR hydration 不匹配问题
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}