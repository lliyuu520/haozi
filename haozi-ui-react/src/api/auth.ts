import service from '@/utils/request'
import type {LoginForm, LoginResponse, UserInfo} from '@/types/user'

// 登录接口
export const loginApi = (data: LoginForm) => {
  return service.post<LoginResponse>('/sys/auth/login', data)
}

// 登出接口
export const logoutApi = () => {
  return service.post('/sys/auth/logout')
}

// 获取用户信息
export const getUserInfoApi = () => {
  return service.get<UserInfo>('/sys/user/info')
}

// 获取权限列表
export const getAuthorityListApi = () => {
  return service.get<string[]>('/sys/menu/authority')
}

// 修改密码
export const changePasswordApi = (data: any) => {
  return service.put('/sys/user/password', data)
}