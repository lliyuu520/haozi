import React from 'react'
import type {RouteObject} from 'react-router-dom'
import {Navigate} from 'react-router-dom'

const withSuspense = (node: React.ReactNode) => (
  <React.Suspense fallback={<div>Loading...</div>}>
    {node}
  </React.Suspense>
)

// 懒加载组件
const Login = React.lazy(() => import('@/pages/login'))
const Layout = React.lazy(() => import('@/components/Layout'))
const NotFound = React.lazy(() => import('@/pages/404'))
const Home = React.lazy(() => import('@/pages/home'))
const notFoundElement = withSuspense(<NotFound />)

// 常量路由配置
export const constantRoutes: RouteObject[] = [
  {
    path: '/login',
    element: withSuspense(<Login />),
  },
  {
    path: '/404',
    element: notFoundElement,
  },
]

// 布局路由配置（包含路由 + 动态路由）
export const layoutRoute: RouteObject = {
  path: '/',
  element: withSuspense(<Layout />),
  children: [
    {
      path: '',
      element: <Navigate to="/home" replace />,
    },
    // 首页作为常量路由
    {
      path: 'home',
      element: withSuspense(<Home />),
    },
  ],
}

// 动态路由配置（从菜单数据生成）
export let dynamicRoutes: RouteObject[] = []

/**
 * 更新动态路由配置
 * @param routes 要设置的路由配置
 */
export const updateDynamicRoutes = (routes: RouteObject[]) => {
  dynamicRoutes = routes
}

const buildLayoutChildren = (extraRoutes: RouteObject[] = []): RouteObject[] => {
  const baseChildren = layoutRoute.children ? [...layoutRoute.children] : []
  return [
    ...baseChildren,
    ...extraRoutes,
    {
      path: '*',
      element: notFoundElement,
    },
  ]
}

/**
 * 获取完整路由配置（常量路由 + 动态路由）
 */
export const getCompleteRoutes = (): RouteObject[] => {
  const completeRoutes = [
    ...constantRoutes,
    {
      ...layoutRoute,
      children: buildLayoutChildren(dynamicRoutes),
    },
    {
      path: '*',
      element: notFoundElement,
    },
  ]

  // console.log('getCompleteRoutes - 动态路由数量:', dynamicRoutes.length)
  // console.log('getCompleteRoutes - Layout子路由数量:', completeRoutes[1].children?.length)

  return completeRoutes
}

// 默认路由（不包含动态路由）
export const defaultRoutes: RouteObject[] = [
  ...constantRoutes,
  {
    ...layoutRoute,
    children: buildLayoutChildren(),
  },
  {
    path: '*',
    element: notFoundElement,
  },
]

export default defaultRoutes
