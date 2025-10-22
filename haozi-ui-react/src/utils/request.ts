import axios, {AxiosInstance, AxiosResponse} from 'axios'
import {message} from 'antd'
import {useUserStore} from '@/stores'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// NProgress配置
NProgress.configure({ showSpinner: false })

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    // 开启进度条
    NProgress.start()

    // 获取token
    const token = useUserStore.getState().token
    if (token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `${token}`
    }

    return config
  },
  (error) => {
    NProgress.done()
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done()

    const { code, msg } = response.data

    // 请求成功
    if (code === 0) {
      return response.data
    }

    // 未授权
    if (code === 401) {
      message.error('登录已过期，请重新登录')
      useUserStore.getState().clear()
      window.location.href = '/login'
      return Promise.reject(new Error(msg || '未授权'))
    }

    // 权限不足
    if (code === 403) {
      message.error('权限不足')
      return Promise.reject(new Error(msg || '权限不足'))
    }

    // 其他错误
    message.error(msg || '请求失败')
    return Promise.reject(new Error(msg || '请求失败'))
  },
  (error) => {
    NProgress.done()

    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录')
          useUserStore.getState().clear()
          window.location.href = '/login'
          return Promise.reject(error)
        case 403:
          message.error('权限不足')
          return Promise.reject(error)
        case 404:
          message.error('请求的资源不存在')
          return Promise.reject(error)
        case 500:
          message.error('服务器内部错误')
          return Promise.reject(error)
        default:
          message.error(data?.msg || '网络错误')
          return Promise.reject(error)
      }
    } else if (error.request) {
      message.error('网络连接失败')
      return Promise.reject(error)
    } else {
      message.error('请求配置错误')
      return Promise.reject(error)
    }
  }
)

export default service