import { App } from 'vue'
import SubmitButton from './SubmitButton.vue'

export default SubmitButton

export { SubmitButton }

/**
 * 安装 SubmitButton 组件
 * @param {App} app - Vue应用实例
 */
export function setupSubmitButton(app: App) {
  app.component('SubmitButton', SubmitButton)
}