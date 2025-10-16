import React from 'react'
import {useRoutes} from 'react-router-dom'
import {ConfigProvider, Spin, theme} from 'antd'
import {DynamicRoutesProvider, useDynamicRoutes} from './hooks/useDynamicRoutes'
import {useUserStore} from './stores'
import {defaultRoutes, getCompleteRoutes} from './router'

const AppContent: React.FC = () => {
  const { dynamicRoutes, isRoutesReady } = useDynamicRoutes()
  const { isAuthenticated } = useUserStore()
  const [shouldRefresh, setShouldRefresh] = React.useState(false)

  // 添加调试信息
  // console.log('AppContent - isAuthenticated:', isAuthenticated)
  // console.log('AppContent - isRoutesReady:', isRoutesReady)
  // console.log('AppContent - dynamicRoutes length:', dynamicRoutes.length)

  // 监听路由准备状态变化
  React.useEffect(() => {
    if (isAuthenticated && isRoutesReady && dynamicRoutes.length > 0) {
      // 当路由准备好后，如果当前URL不是首页，触发刷新
      const currentPath = window.location.pathname
      if (currentPath !== '/home' && currentPath !== '/') {
        setShouldRefresh(true)
        // 短暂延迟后刷新页面
        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
    }
  }, [isAuthenticated, isRoutesReady, dynamicRoutes.length])

  // 如果正在等待刷新，显示加载状态
  if (shouldRefresh) {
    return (
      <div className="flex-center full-height">
        <Spin size="large" tip="正在初始化路由..." />
      </div>
    )
  }

  // 处理路由选择逻辑
  let routes
  if (isAuthenticated && isRoutesReady && dynamicRoutes.length > 0) {
    routes = getCompleteRoutes()
  } else if (!isAuthenticated) {
    routes = defaultRoutes
  } else {
    // 如果用户已认证但路由未准备好，先使用默认路由避免404
    routes = defaultRoutes
  }

  const element = useRoutes(routes)

  return (
    <div className="app">
      {element}
    </div>
  )
}

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <DynamicRoutesProvider>
        <AppContent />
      </DynamicRoutesProvider>
    </ConfigProvider>
  )
}

export default App