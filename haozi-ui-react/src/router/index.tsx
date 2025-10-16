import React from 'react'
import type {RouteObject} from 'react-router-dom'
import {Navigate} from 'react-router-dom'

// 懒加载基础组件
const Login = React.lazy(() => import('@/pages/login'))
const Layout = React.lazy(() => import('@/components/Layout'))
const NotFound = React.lazy(() => import('@/pages/404'))
const Home = React.lazy(() => import('@/pages/home'))

// 基础路由配置
export const constantRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <React.Suspense fallback={<div>加载中...</div>}>
        <Login />
      </React.Suspense>
    ),
  },
  {
    path: '/404',
    element: (
      <React.Suspense fallback={<div>加载中...</div>}>
        <NotFound />
      </React.Suspense>
    ),
  },
]

// 主布局路由配置（基础路由 + 动态路由）
export const layoutRoute: RouteObject = {
  path: '/',
  element: (
    <React.Suspense fallback={<div>加载中...</div>}>
      <Layout />
    </React.Suspense>
  ),
  children: [
    {
      path: '',
      element: <Navigate to="/home" replace />,
    },
    // 首页作为基础路由
    {
      path: 'home',
      element: (
        <React.Suspense fallback={<div>加载中...</div>}>
          <Home />
        </React.Suspense>
      ),
    },
  ],
}

// 动态路由配置（从菜单数据生成）
export let dynamicRoutes: RouteObject[] = []

/**
 * 更新动态路由配置
 * @param routes 要设置的路由数组
 */
export const updateDynamicRoutes = (routes: RouteObject[]) => {
  dynamicRoutes = routes
}

/**
 * 获取完整的路由配置（基础路由 + 动态路由）
 */
export const getCompleteRoutes = (): RouteObject[] => {
  const completeRoutes = [
    ...constantRoutes,
    {
      ...layoutRoute,
      children: [
        ...(layoutRoute.children || []),
        ...dynamicRoutes
      ]
    },
    {
      path: '*',
      element: (
        <React.Suspense fallback={<div>加载中...</div>}>
          <NotFound />
        </React.Suspense>
      ),
    },
  ]

  // console.log('getCompleteRoutes - 动态路由数量:', dynamicRoutes.length)
  // console.log('getCompleteRoutes - Layout子路由总数:', completeRoutes[1].children?.length)

  return completeRoutes
}

// 默认路由（包含静态路由）
export const defaultRoutes: RouteObject[] = [
  ...constantRoutes,
  layoutRoute,
  {
    path: '*',
    element: (
      <React.Suspense fallback={<div>加载中...</div>}>
        <NotFound />
      </React.Suspense>
    ),
  },
]

export default defaultRoutes