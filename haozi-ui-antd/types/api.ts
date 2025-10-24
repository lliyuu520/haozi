// API 响应基础类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
  success: boolean;
}

// 分页响应数据类型
export interface PageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 分页请求参数
export interface PageParams {
  current?: number;
  size?: number;
  [key: string]: any;
}

// 通用状态类型
export type Status = 0 | 1 | 2; // 0-禁用 1-正常 2-删除

// 性别类型
export type Gender = 0 | 1 | 2; // 0-未知 1-男 2-女

// 是否类型
export type YesNo = 0 | 1; // 0-否 1-是