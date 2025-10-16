import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {getAuthorityListApi, getUserInfoApi, loginApi, logoutApi} from '@/api/auth'
import {getToken, removeToken, setToken} from '@/utils/auth'
import type {UserInfo} from '@/types/user'

interface UserState {
  user: UserInfo
  authorityList: string[]
  token: string
  isAuthenticated: boolean
  setUser: (user: UserInfo) => void
  setAuthorityList: (authorities: string[]) => void
  setToken: (token: string) => void
  login: (loginForm: any) => Promise<void>
  logout: () => Promise<void>
  getUserInfo: () => Promise<void>
  getAuthorityList: () => Promise<void>
  hasPermission: (permission: string) => boolean
  clear: () => void
}

const initialState = {
  user: {
    id: '',
    username: '',
    avatar: '',
    email: '',
    phone: '',
    status: 1,
  },
  authorityList: [],
  token: getToken() || '',
  isAuthenticated: !!getToken(),
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user: UserInfo) => {
        set({ user })
      },

      setAuthorityList: (authorityList: string[]) => {
        set({ authorityList })
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: !!token })
        setToken(token)
      },

      login: async (loginForm: any) => {
        try {
          const { data } = await loginApi(loginForm)
          get().setToken(data.accessToken)
          await get().getUserInfo()
          await get().getAuthorityList()
        } catch (error) {
          get().clear()
          throw error
        }
      },

      logout: async () => {
        try {
          await logoutApi()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          get().clear()
        }
      },

      getUserInfo: async () => {
        try {
          const { data } = await getUserInfoApi()
          get().setUser(data)
        } catch (error) {
          console.error('Get user info error:', error)
          throw error
        }
      },

      getAuthorityList: async () => {
        try {
          const { data } = await getAuthorityListApi()
          get().setAuthorityList(data || [])
        } catch (error) {
          console.error('Get authority list error:', error)
          throw error
        }
      },

      hasPermission: (permission: string) => {
        const { authorityList } = get()
        return authorityList.includes(permission)
      },

      clear: () => {
        set(initialState)
        removeToken()
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        authorityList: state.authorityList,
      }),
    }
  )
)