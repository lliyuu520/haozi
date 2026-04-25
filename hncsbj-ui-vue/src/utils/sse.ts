/**
 * SSE工具类
 */
import {ElNotification} from 'element-plus'
import store from "@/store";

/**
 * 显示气泡通知
 */
const showNotificationBubble = (data: any) => {
  const { type,title, message } = data

  
  // 显示气泡通知
  ElNotification({
    title :title,
    message:  message,
    type: type,
      position: 'bottom-right',

  })
}
interface SSEOptions {
  url: string
  onMessage?: (event: MessageEvent) => void
  onError?: (event: Event) => void
  onOpen?: (event: Event) => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

class SSEManager {
  private eventSource: EventSource | null = null
  private options: SSEOptions
  private reconnectAttempts = 0
  private reconnectTimer: number | null = null
  private isActive = false

  constructor(options: SSEOptions) {
    this.options = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      ...options
    }
  }

  /**
   * 连接SSE
   */
  connect() {
    if (this.isActive) {
      console.warn('SSE连接已经活跃')
      return
    }

    try {
      this.eventSource = new EventSource(this.options.url)
      
      this.eventSource.onopen = (event) => {
        console.log('SSE连接已打开')
        this.reconnectAttempts = 0 // 重置重连次数
        this.isActive = true
        this.options.onOpen?.(event)
      }

      this.eventSource.onmessage = (event) => {
        console.log('收到SSE消息:', event)
        this.options.onMessage?.(event)
      }

      this.eventSource.onerror = (event) => {
        console.error('SSE连接错误:', event)
        this.options.onError?.(event)
        this.handleConnectionError()
      }

    } catch (error) {
      console.error('SSE连接失败:', error)
      this.handleConnectionError()
    }
  }

  /**
   * 处理连接错误
   */
  private handleConnectionError() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    this.isActive = false

    // 检查重连次数限制
    if (this.reconnectAttempts < this.options.maxReconnectAttempts!) {
      this.reconnectAttempts++
      console.log(`尝试重连第${this.reconnectAttempts}次...`)
      
      this.reconnectTimer = window.setTimeout(() => {
        this.connect()
      }, this.options.reconnectInterval!)
    } else {
      console.error('达到最大重连次数，停止重连')
    }
  }

  /**
   * 关闭连接
   */
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    this.isActive = false
    this.reconnectAttempts = 0
    console.log('SSE连接已关闭')
  }

  /**
   * 判断是否连接
   */
  isConnected() {
    return this.isActive && this.eventSource?.readyState === EventSource.OPEN
  }
}

// 单例模式的全局SSE管理器
let globalSSEManager: SSEManager | null = null

/**
 * 创建SSE连接
 */
export const createSSEConnection = (options: SSEOptions): SSEManager => {
  if (globalSSEManager) {
    globalSSEManager.disconnect()
  }
  
  globalSSEManager = new SSEManager(options)
  globalSSEManager.connect()
  
  return globalSSEManager
}

/**
 * 获取全局SSE管理器
 */
export const getSSEManager = (): SSEManager | null => {
  return globalSSEManager
}

/**
 * 关闭全局SSE连接
 */
export const closeSSEConnection = () => {
  if (globalSSEManager) {
    globalSSEManager.disconnect()
    globalSSEManager = null
  }
}

/**
 * 监听下载通知
 */
export const listenDownloadNotifications = () => {
  // 检查是否已有活跃的SSE连接
  if (globalSSEManager && globalSSEManager.isConnected()) {
    console.log('SSE连接已存在且活跃，跳过重复创建')
    return globalSSEManager
  }

  // 获取当前用户ID，这里需要根据你的用户信息获取方式来调整
  const userId = getCurrentUserId()

  if (!userId) {
    console.error('无法获取当前用户ID，无法建立SSE连接')
    return null
  }

  const backendUrl = `${getBackendApiUrl()}/sys/sse/createSSEConnection/${userId}`
  return createSSEConnection({
    url: backendUrl,
    onMessage: (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        console.log('收到下载通知:', data)
            showNotificationBubble(data)

      } catch (error) {
        console.error('解析SSE消息失败:', error)
      }
    },
    onError: (event) => {
      console.error('下载通知SSE连接错误:', event)
    },
    onOpen: (event) => {
      console.log('下载通知SSE连接已打开')
    }
  })
}

/**
 * 获取当前用户ID
 */
const getCurrentUserId = (): number  => {

      return store.userStore.user.id

}

/**
 * 获取后端API基础URL
 */
const getBackendApiUrl = (): string => {
  // 从环境变量获取API基础URL
  return import.meta.env.VITE_API_URL || '/api'
}