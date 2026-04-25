import store from '@/store'
import {isExternalLink, pathToCamel} from '@/utils/tool'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

NProgress.configure({ showSpinner: false })

const constantRoutes: RouteRecordRaw[] = [
	{
		path: '/redirect',
		component: () => import('../layout/index.vue'),
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('../layout/components/Router/Redirect.vue')
			}
		]
	},
	{
		path: '/iframe/:query?',
		component: () => import('../layout/components/Router/Iframe.vue')
	},
	{
		path: '/login',
		component: () => import('../views/login/index.vue')
	},
	{
		path: '/404',
		component: () => import('../views/404.vue')
	}
]

const asyncRoutes: RouteRecordRaw = {
	path: '/',
	component: () => import('../layout/index.vue'),
	redirect: '/home',
	children: [
		{
			path: '/home',
			name: 'Home',
			component: () => import('../views/monitor/server/index.vue'),
			meta: {
				title: '首页',
				affix: true
			}
		},
		{
			path: '/profile/password',
			name: 'ProfilePassword',
			component: () => import('../views/profile/password.vue'),
			meta: {
				title: '重置密码',
				cache: true
			}
		},
		/* 业务路由由后台动态提供，此处无需静态配置 */
	]
}

// 配置常量菜单

export const errorRoute: RouteRecordRaw = {
	path: '/:pathMatch(.*)',
	redirect: '/404'
}

export const router = createRouter({
	history: createWebHashHistory(),
	routes: constantRoutes
})

// 白名单列表
const whiteList = ['/login']

// 路由跳转前
router.beforeEach(async (to, from, next) => {
	NProgress.start()

	// token存在的情况
	if (store.userStore.token) {
		if (to.path === '/login') {
			next('/home')
		} else {
			// 用户信息不存在，则重新拉取
			if (!store.userStore.user.id) {
				try {
					// 获取用户信息
					await store.userStore.getUserInfoAction()
					// 获取权限列表
					await store.userStore.getAuthorityListAction()

					//字典 缓存

					await store.appStore.getDictListAction()
                    // 配置 缓存
                    await store.appStore.getSysConfigListAction()

					// 动态菜单+常量菜单
					const menuRoutes = await store.routerStore.getMenuRoutes()
					if (!menuRoutes || menuRoutes.length === 0) {
						throw new Error('Failed to load menu routes')
					}

					// 获取扁平化路由，将多级路由转换成一级路由
					const keepAliveRoutes = getKeepAliveRoutes(menuRoutes, [])

					// 添加菜单路由
					asyncRoutes.children?.push(...keepAliveRoutes)
					router.addRoute(asyncRoutes)

					// 错误路由
					router.addRoute(errorRoute)

					// 保存路由数据
					store.routerStore.setRoutes(constantRoutes.concat(asyncRoutes))

					next({ ...to, replace: true })
				} catch (error) {
					console.error('Failed to initialize routes:', error)
					// 清除token和用户信息
					store.userStore.setToken('')
					store.userStore.setUser({ id: '', username: '', avatar: '' })
					// 重置菜单状态
					store.routerStore.resetMenuState()
					// 重定向到登录页
					next('/login')
					return Promise.reject(error)
				}
			} else {
				next()
			}
		}
	} else {
		// 没有token的情况下，可以进入白名单
		if (whiteList.indexOf(to.path) > -1) {
			next()
		} else {
			next('/login')
		}
	}
})

// 路由加载后
router.afterEach(() => {
	NProgress.done()
})

// 获取扁平化路由，将多级路由转换成一级路由
export const getKeepAliveRoutes = (rs: RouteRecordRaw[], breadcrumb: string[]): RouteRecordRaw[] => {
	const routerList: RouteRecordRaw[] = []

	rs.forEach((item: any) => {
		if (item.meta.title) {
			breadcrumb.push(item.meta.title)
		}

		if (item.children && item.children.length > 0) {
			routerList.push(...getKeepAliveRoutes(item.children, breadcrumb))
		} else {
			item.meta.breadcrumb.push(...breadcrumb)
			routerList.push(item)
		}

		breadcrumb.pop()
	})
	return routerList
}

// 加载vue组件
const layoutModules = import.meta.glob('/src/views/**/*.vue')

// 根据路径，动态获取vue组件
const getDynamicComponent = (path: string, name: string): any => {
	const dynamicComponent = layoutModules[`/src/views/${path}.vue`]
	if (!dynamicComponent) {
		console.warn(`Dynamic component for path "${path}" not found`)
		return async () => {
			throw new Error(`Component for path "${path}" not found`)
		}
	}
	return async () => {
		const componentModule: any = await dynamicComponent()
		const component = componentModule.default || componentModule
		if (component) {
			if (component.name !== name) {
				component.name = name
			}
			if ('__name' in component && component.__name !== name) {
				component.__name = name
			}
		}
		return component
	}
}

// 根据菜单列表，生成路由数据
export const generateRoutes = (menuList: any): RouteRecordRaw[] => {
	const routerList: RouteRecordRaw[] = []

	menuList.forEach((menu: any) => {
		let component
		let path
		if (menu.children && menu.children.length > 0) {
			component = () => import('@/layout/index.vue')
			path = '/p/' + menu.id
		} else {
			// 判断是否iframe
			if (isIframeUrl(menu)) {
				path = '/iframe/' + menu.id
				component = () => import('@/layout/components/Router/Iframe.vue')
			} else {
				path = '/' + menu.url
				const dynamicName = pathToCamel(path)
				component = getDynamicComponent(menu.url, dynamicName)
			}
		}
		const routeName = pathToCamel(path)
		const route: RouteRecordRaw = {
			path: path,
			name: routeName,
			component: component,
			children: [],
			meta: {
				title: menu.name,
				icon: menu.icon || '',
				id: '' + menu.id,
				url: menu.url,
				cache: true,
				componentName: routeName,
				newOpen: menu.openStyle === 1,
				breadcrumb: []
			}
		}

		// 有子菜单的情况
		if (menu.children && menu.children.length > 0) {
			route.children?.push(...generateRoutes(menu.children))
		}

		routerList.push(route)
	})

	return routerList
}

// 判断是否iframe
const isIframeUrl = (menu: any): boolean => {
	// 如果是新页面打开，则不用iframe
	if (menu.openStyle === 1) {
		return false
	}

	// 是否外部链接
	return isExternalLink(menu.url)
}
