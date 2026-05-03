/**
 * 后端统一响应信封
 */
export type ResultEnvelope<T> = {
  code: number | string;
  msg?: string;
  message?: string;
  data?: T;
};

/**
 * 后端错误响应
 */
export type ApiError = {
  code: string;
  message: string;
  path: string;
  timestamp: string;
  traceId?: string | null;
  details?: Record<string, string>;
};

/**
 * 新版分页结果
 */
export type PageResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
