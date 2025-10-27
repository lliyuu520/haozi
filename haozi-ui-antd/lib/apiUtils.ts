/**
 * API 错误处理工具
 * 提供统一的错误处理机制，确保所有 API 调用都有适当的错误处理
 */

/**
 * 处理 API 错误的通用函数
 * @param operationName 操作名称，用于错误日志
 * @param error 错误对象
 * @throws 重新抛出错误，让调用者进一步处理
 */
export const handleApiError = (operationName: string, error: unknown): never => {
  console.error(`${operationName}失败:`, error);
  throw error;
};

/**
 * 为 API Promise 添加标准错误处理
 * @param promise API 请求的 Promise
 * @param operationName 操作名称
 * @returns 处理后的 Promise
 */
export const withErrorHandling = <T>(
  promise: Promise<T>,
  operationName: string
): Promise<T> => {
  return promise.catch(error => handleApiError(operationName, error));
};