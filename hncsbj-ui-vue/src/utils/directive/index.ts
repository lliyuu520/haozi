import type {App} from 'vue'
import {auth, fieldAuth} from './auth'

export const directive = (app: App) => {
	// 权限指令
	auth(app)
	// 字段权限指令
	fieldAuth(app)
}
