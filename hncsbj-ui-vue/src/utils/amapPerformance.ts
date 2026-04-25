// 高德地图性能优化工具
export class AmapPerformanceOptimizer {
  private static initialized = false

  static init() {
    if (this.initialized) return
    
    this.initialized = true
    
    // 监听高德地图加载完成事件
    if (typeof window !== 'undefined') {
      this.setupGlobalOptimizations()
    }
  }

  private static setupGlobalOptimizations() {
    // 优化触摸事件监听器
    this.optimizeTouchEventListeners()
    
    // 优化Canvas性能
    this.optimizeCanvasPerformance()
    
    // 减少DOM重绘
    this.reduceDOMReflow()
  }

  private static optimizeTouchEventListeners() {
    // 为高德地图的触摸事件添加被动监听器
    const originalAddEventListener = EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener = function(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      // 对高德地图的触摸事件使用被动监听器
      if (type === 'touchstart' || type === 'touchmove') {
        if (typeof options === 'object') {
          options.passive = true
        } else if (options === undefined) {
          options = { passive: true }
        } else if (typeof options === 'boolean' && options) {
          options = { passive: true, capture: true }
        }
      }
      
      return originalAddEventListener.call(this, type, listener, options)
    }
  }

  private static optimizeCanvasPerformance() {
    // 监控Canvas元素创建
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'CANVAS') {
            this.setupCanvasOptimization(node as HTMLCanvasElement)
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const canvas = (node as Element).querySelector('canvas')
            if (canvas) {
              this.setupCanvasOptimization(canvas as HTMLCanvasElement)
            }
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  private static setupCanvasOptimization(canvas: HTMLCanvasElement) {
    // 设置willReadFrequently属性优化多次读取操作
    canvas.setAttribute('willReadFrequently', 'true')
    
    // 优化CSS属性
    canvas.style.willChange = 'transform'
    canvas.style.imageRendering = 'high-quality'
    
    // 优化Canvas上下文
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }
  }

  private static reduceDOMReflow() {
    // 减少不必要的DOM重绘
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        this.performDOMOptimizations()
      })
    } else {
      setTimeout(() => {
        this.performDOMOptimizations()
      }, 1000)
    }
  }

  private static performDOMOptimizations() {
    // 批量处理DOM操作
    const elements = document.querySelectorAll('.amap-container')
    elements.forEach((element) => {
      // 优化CSS transform
      (element as HTMLElement).style.transform = 'translateZ(0)'
      
      // 启用GPU加速
      (element as HTMLElement).style.backfaceVisibility = 'hidden'
      (element as HTMLElement).style.perspective = '1000px'
    })
  }
}

// 自动初始化
if (typeof window !== 'undefined') {
  // 等待页面加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      AmapPerformanceOptimizer.init()
    })
  } else {
    AmapPerformanceOptimizer.init()
  }
}