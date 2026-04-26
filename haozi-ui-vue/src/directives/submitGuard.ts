import type { App, Directive, DirectiveBinding } from 'vue'

/**
 * 防重复点击指令
 * 使用方式：v-submit-guard="[submitFn, options]"
 * submitFn: 提交函数
 * options: 配置选项
 */
export const submitGuardDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const [submitFn, options = {}] = binding.value || []
    
    if (typeof submitFn !== 'function') {
      console.warn('v-submit-guard 需要一个函数作为第一个参数')
      return
    }
    
    let submitting = false
    
    const clickHandler = async (event: Event) => {
      event.preventDefault()
      
      if (submitting) {
        return
      }
      
      const button = el as HTMLButtonElement
      const originalText = button.textContent || ''
      const loadingText = options.loadingText || '提交中...'
      const { duration = 3000, onSuccess, onError, onFinally } = options
      
      submitting = true
      
      // 更新按钮状态
      button.disabled = true
      button.textContent = loadingText
      
      try {
        // 设置超时保护
        const timeoutId = setTimeout(() => {
          submitting = false
          button.disabled = false
          button.textContent = originalText
        }, duration)
        
        // 执行提交函数
        const result = await submitFn()
        
        clearTimeout(timeoutId)
        
        // 成功回调
        if (onSuccess) {
          onSuccess(result)
        }
      } catch (error) {
        // 错误回调
        if (onError) {
          onError(error)
        }
      } finally {
        submitting = false
        button.disabled = false
        button.textContent = originalText
        
        // 最终回调
        if (onFinally) {
          onFinally()
        }
      }
    }
    
    // 保存事件处理器，便于后续移除
    ;(el as any)._submitGuardHandler = clickHandler
    
    // 添加点击事件
    el.addEventListener('click', clickHandler)
  },
  
  unmounted(el: HTMLElement) {
    // 移除事件处理器
    const handler = (el as any)._submitGuardHandler
    if (handler) {
      el.removeEventListener('click', handler)
    }
  }
}

/**
 * 安装防重复点击指令
 * @param {App} app - Vue应用实例
 */
export function setupSubmitGuardDirective(app: App) {
  app.directive('submit-guard', submitGuardDirective)
}