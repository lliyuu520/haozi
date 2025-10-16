import React, {useEffect, useState} from 'react'
import {Layout as AntLayout, Spin} from 'antd'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import {useUserStore} from '@/stores'
import Sidebar from './Sidebar'
import Header from './Header'
import {getAuthorityListApi, getUserInfoApi} from '@/api/auth'
import {getMenuNavApi} from '@/api/sys/menu'
import {useDynamicRoutes} from '@/hooks/useDynamicRoutes'
import type {SysMenu} from '@/types/sys/menu'

const { Content } = AntLayout

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = React.useState(true)
  const [menuData, setMenuData] = useState<SysMenu[]>([])

  // 只选择必要的状态，避免不必要的重新渲染
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const { updateRoutes } = useDynamicRoutes()

  // 添加组件重新渲染监控
  const renderCount = React.useRef(0)
  renderCount.current += 1
  if (renderCount.current % 10 === 0) { // 减少频率，避免控制台刷屏
    // console.log(`Layout 组件第 ${renderCount.current} 次渲染`)
  }

  // 使用useRef来确保初始化只执行一次
  const initializedRef = React.useRef(false)

  // 简化的初始化逻辑
  useEffect(() => {
    const initializeApp = async () => {
      // 如果已经初始化过，直接返回
      if (initializedRef.current) {
        return
      }

      try {
        if (!isAuthenticated) {
          navigate('/login')
          return
        }

        // 获取用户信息、权限和菜单数据
        const [, , menuResponse] = await Promise.all([
          getUserInfoApi(),
          getAuthorityListApi(),
          getMenuNavApi()
        ])

        // 设置菜单数据并生成动态路由
        if (menuResponse && menuResponse.data) {
          setMenuData(menuResponse.data)
          updateRoutes(menuResponse.data)
        }

        setLoading(false)
        // 标记初始化完成
        initializedRef.current = true
      } catch (error) {
        console.error('应用初始化失败:', error)
        navigate('/login')
        setLoading(false)
      }
    }

    initializeApp()
  }, [isAuthenticated, navigate, updateRoutes])

  // 处理页面刷新时的初始化问题
  useEffect(() => {
    // 监听浏览器的popstate事件（前进/后退/刷新）
    const handlePopState = () => {
      if (isAuthenticated && menuData.length === 0 && !loading) {
        // 检测到页面刷新或导航，重新初始化路由
        initializedRef.current = false
        setLoading(true)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isAuthenticated, menuData.length, loading])

  // 不需要布局的页面
  const noLayoutPages = ['/login', '/404']
  if (noLayoutPages.includes(location.pathname)) {
    return <Outlet />
  }

  if (loading) {
    return (
      <div className="flex-center full-height">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sidebar onCollapse={setSidebarCollapsed} menuData={menuData} />
      <AntLayout style={{ marginLeft: sidebarCollapsed ? 64 : 200, transition: 'margin-left 0.2s' }}>
        <Header collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
        <Content style={{ margin: '8px', padding: '16px', background: '#fff', minHeight: '280px' }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout