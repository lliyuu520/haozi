import {useMenuNavApi} from '@/api/sys/menu'
import {generateRoutes} from '@/router'
import {defineStore} from 'pinia'
import {RouteRecordRaw} from 'vue-router'

export const routerStore = defineStore('routerStore', {
	state: () => ({
		menuRoutes: [] as RouteRecordRaw[],
		routes: [] as RouteRecordRaw[],
		isMenuLoaded: false
	}),
	actions: {
		async getMenuRoutes() {
			// 如果已经加载过菜单，直接返回
			if (this.isMenuLoaded) {
				return this.menuRoutes
			}

			try {
				const { data } = await useMenuNavApi()
				const routes = generateRoutes(data)

				// 清空现有路由
				this.menuRoutes = []
				// 添加新路由
				this.menuRoutes.push(...routes)
				// 标记菜单已加载
				this.isMenuLoaded = true

				return this.menuRoutes
			} catch (error) {
				console.error('Failed to load menu routes:', error)
				return []
			}
		},
		setRoutes(routers: RouteRecordRaw[]) {
			this.routes = routers
		},
		// 重置菜单状态
		resetMenuState() {
			this.menuRoutes = []
			this.isMenuLoaded = false
		}
	}
})
