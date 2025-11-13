'use client';

/**
 * 默认并行路由出口：当没有拦截到任何弹窗路由时保持空渲染，避免页面自动弹出。
 */
export default function RoleModalFallback() {
  return null;
}
