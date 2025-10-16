const TOKEN_KEY = 'haozi_token'
const USER_KEY = 'haozi_user'

// Token管理
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

// 用户信息管理
export const setUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUser = (): any => {
  const userStr = localStorage.getItem(USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY)
}

// 权限检查
export const hasPermission = (permission: string): boolean => {
  const user = getUser()
  if (!user || !user.authorities) {
    return false
  }
  return user.authorities.some((auth: any) => auth.authority === permission)
}

// 清除所有认证信息
export const clearAuth = (): void => {
  removeToken()
  removeUser()
}