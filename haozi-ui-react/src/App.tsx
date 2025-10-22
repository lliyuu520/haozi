import React from 'react'
import {useRoutes} from 'react-router-dom'
import {ConfigProvider, theme} from 'antd'
import {DynamicRoutesProvider, useDynamicRoutes} from './hooks/useDynamicRoutes'
import {useUserStore} from './stores'
import {defaultRoutes, getCompleteRoutes} from './router'

const AppContent: React.FC = () => {
  const { dynamicRoutes, isRoutesReady } = useDynamicRoutes()
  const { isAuthenticated } = useUserStore()

  const routes = React.useMemo(() => {
    if (!isAuthenticated) {
      return defaultRoutes
    }

    if (isRoutesReady && dynamicRoutes.length > 0) {
      return getCompleteRoutes()
    }

    return defaultRoutes
  }, [isAuthenticated, isRoutesReady, dynamicRoutes.length])

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
