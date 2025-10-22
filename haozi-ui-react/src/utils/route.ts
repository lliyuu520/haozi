import React from 'react'
import {Spin} from 'antd'
import type {RouteObject} from 'react-router-dom'
import type {SysMenu} from '@/types/sys/menu'

// 组件映射表 - 预定义可用的页面组件
const componentMap: Record<string, React.ComponentType> = {
  'sys/user/index': React.lazy(() => import('@/pages/sys/user/index')),
  'sys/menu/index': React.lazy(() => import('@/pages/sys/menu/index')),
  'sys/role/index': React.lazy(() => import('@/pages/sys/role/index')),
  'home': React.lazy(() => import('@/pages/home')),
}

/**
 * 根据菜单数据生成路由配置
 * @param menus 菜单数据
 * @returns 路由配置数组
 */
export const generateRoutes = (menus: SysMenu[]): RouteObject[] => {
  const routes: RouteObject[] = []

  // 安全检查：确保menus是数组且不为空
  if (!menus || !Array.isArray(menus) || menus.length === 0) {
    console.warn('generateRoutes: menus参数为空或不是数组', menus)
    return routes
  }

  // 递归处理菜单数据生成路由配置
  const processMenu = (menu: SysMenu): RouteObject | null => {

    // 只处理类型为 0 的菜单（0是菜单，1是按钮，2是接口）
    if (menu.type !== 0) {
      return null
    }

    // 如果有URL，直接生成路由（这是实际的页面路由）
    if (menu.url) {
      const path = menu.url.startsWith('/') ? menu.url.slice(1) : menu.url

      // 检查组件映射表中是否有对应的组件
      const Component = componentMap[path]
      if (!Component) {
        return null
      }

      return {
        path,
        element: React.createElement(
          React.Suspense,
          { fallback: React.createElement(Spin, { size: 'large' }) },
          React.createElement(Component)
        )
      }
    }

    // 如果没有URL但有子菜单，递归处理子菜单，但只处理子菜单，不创建父级包装路由
    if (menu.children && menu.children.length > 0) {

      // 直接递归处理子菜单，并返回null（不创建父级路由）
      menu.children.forEach(childMenu => {
        const childRoute = processMenu(childMenu)
        if (childRoute) {
          routes.push(childRoute)
        }
      })

      return null // 父级菜单不创建路由
    }

    // 既没有URL也没有有效子菜单，不生成路由
    return null
  }

  // 处理所有菜单
  menus.forEach(menu => {
    const route = processMenu(menu)
    if (route) {
      routes.push(route)
    }
  })

  return routes
}




