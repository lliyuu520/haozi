import { ref } from 'vue'

/**
 * 防重复点击 Hook
 * 用于防止按钮在短时间内被多次点击，避免重复请求
 */
export function useSubmitGuard() {
  const submitting = ref<boolean>(false)
  
  /**
   * 提交包装函数
   * @param submitFn - 实际的提交函数
   * @param options - 配置选项
   * @returns 包装后的提交函数
   */
  const submitWithGuard = <T extends any[], R>(
    submitFn: (...args: T) => Promise<R>,
    options: SubmitGuardOptions<T, R> = {}
  ) => {
    const {
      duration = 3000,
      onSuccess,
      onError,
      onFinally
    } = options
    
    return async (...args: T): Promise<R> => {
      // 如果正在提交中，直接返回
      if (submitting.value) {
        return Promise.reject(new Error('提交中，请勿重复操作'))
      }
      
      let timeoutId: number | null = null
      
      try {
        submitting.value = true
        
        // 设置超时保护，防止请求卡死导致按钮一直禁用
        timeoutId = setTimeout(() => {
          submitting.value = false
          timeoutId = null
        }, duration)
        
        // 执行提交函数
        const result = await submitFn(...args)
        
        // 清除超时保护
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        
        // 成功回调
        if (onSuccess) {
          onSuccess(result)
        }
        
        return result
      } catch (error) {
        // 错误回调
        if (onError) {
          onError(error as Error)
        }
        
        throw error
      } finally {
        // 只有在超时保护还存在的情况下才重置状态
        if (timeoutId) {
          clearTimeout(timeoutId)
          submitting.value = false
        }
        
        // 最终回调
        if (onFinally) {
          onFinally()
        }
      }
    }
  }
  
  /**
   * 重置提交状态
   */
  const resetSubmitState = (): void => {
    submitting.value = false
  }
  
  return {
    submitting,
    submitWithGuard,
    resetSubmitState
  }
}

/**
 * 提交保护选项接口
 */
interface SubmitGuardOptions<T extends any[], R> {
  /** 提交持续时间（毫秒），默认3000ms */
  duration?: number
  /** 成功回调 */
  onSuccess?: (result: R) => void
  /** 错误回调 */
  onError?: (error: Error) => void
  /** 最终回调 */
  onFinally?: () => void
}