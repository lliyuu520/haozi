// 高德地图类型声明
declare module 'AMap' {
  interface AMap {
    // 核心功能
    version: string
    Plugin: any
    service: any
    
    // 地图实例方法
    setSize(width: number, height: number): void
    setCenter(center: [number, number]): void
    setZoom(zoom: number): void
    setCenterAndZoom(center: [number, number], zoom: number): void
    
    // 事件相关
    on(event: string, handler: Function): void
    off(event: string, handler: Function): void
    
    // 控件相关
    control?: any
    plugin?: any
  }
}

// 扩展Window接口
declare global {
  interface Window {
    AMap: {
      new (container: HTMLElement | string, options?: any): any
      version: string
      Plugin: any
      // 其他静态方法和属性
    }
  }
}

export default AMap