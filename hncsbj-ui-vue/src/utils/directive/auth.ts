import store from '@/store'
import type {App} from 'vue'

export function auth(app: App) {
	// 权限验证
	app.directive('auth', {
		mounted(el, binding) {
			if (!store.userStore.authorityList.some((v: string) => v === binding.value)) {
				el.parentNode.removeChild(el)
			}
		}
	})
}

// 字段权限验证
export function fieldAuth(app: App) {
	app.directive('fieldAuth', {
		mounted(el, binding) {
			if (!store.userStore.fieldAuthorityList.some((v: string) => v === binding.value)) {
				el.parentNode.removeChild(el)
			}
		}
	})
}