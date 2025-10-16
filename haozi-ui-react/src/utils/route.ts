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

/**
 * 延迟加载路由组件的函数
 * 在实际路由匹配时调用
 */
export const loadRouteComponent = (route: RouteObject): RouteObject => {
  // 创建一个新的路由对象，避免修改原对象
  return {
    ...route
  }
}

/**
 * 动态加载组件
 * @param componentPath 组件路径，如 'sys/user/index'
 * @returns React组件
 */
const getDynamicComponent = (componentPath: string) => {
  if (!componentPath || typeof componentPath !== 'string') {
    return React.lazy(() => import('@/pages/404'))
  }

  try {
    // 将路径转换为组件导入格式
    // 例如: 'sys/user/index' -> '@/pages/sys/user/index'
    const importPath = `@/pages/${componentPath}`
    // 动态导入组件
    return React.lazy(() => import(/* @vite-ignore */ importPath))
  } catch (error) {
    // 返回404组件作为fallback
    return React.lazy(() => import('@/pages/404'))
  }
}

/**
 * 过滤出需要路由的菜单项
 * @param menus 所有菜单
 * @returns 需要生成路由的菜单
 */
export const filterRouteMenus = (menus: SysMenu[]): SysMenu[] => {
  const result: SysMenu[] = []

  // 安全检查：确保menus是数组且不为空
  if (!menus || !Array.isArray(menus) || menus.length === 0) {
    console.warn('filterRouteMenus: menus参数为空或不是数组', menus)
    return result
  }

  const filter = (items: SysMenu[]) => {
    items.forEach(item => {
      // 只处理类型为 0 且有URL的菜单项
      if (item.type === 0 && item.url) {
        result.push(item)
      }
      // 递归处理子菜单
      if (item.children && item.children.length > 0) {
        filter(item.children)
      }
    })
  }

  filter(menus)
  return result
}

/**
 * 从菜单中提取权限列表
 * @param menus 菜单数据
 * @returns 权限列表
 */
export const extractPermissions = (menus: SysMenu[]): string[] => {
  const permissions: string[] = []

  // 安全检查：确保menus是数组且不为空
  if (!menus || !Array.isArray(menus) || menus.length === 0) {
    console.warn('extractPermissions: menus参数为空或不是数组', menus)
    return permissions
  }

  const extract = (items: SysMenu[]) => {
    items.forEach(item => {
      // 收集所有权限标识
      if (item.perms) {
        permissions.push(item.perms)
      }
      // 递归处理子菜单
      if (item.children && item.children.length > 0) {
        extract(item.children)
      }
    })
  }

  extract(menus)
  return permissions
}