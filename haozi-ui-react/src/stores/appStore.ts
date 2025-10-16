import {create} from 'zustand'
import {getDictListApi, getSysConfigListApi} from '@/api/sys'
import {dictDataApi} from '@/api/dict'
import type {DictDataItem, DictItem, SysConfigItem} from '@/types/app'

interface AppState {
  dictList: DictItem[]
  sysConfigList: SysConfigItem[]
  loading: boolean
  setDictList: (dictList: DictItem[]) => void
  setSysConfigList: (sysConfigList: SysConfigItem[]) => void
  setLoading: (loading: boolean) => void
  getDictList: () => Promise<void>
  getSysConfigList: () => Promise<void>
  getDictByType: (dictType: string) => DictItem[]
  getDictDataByType: (dictType: string) => DictDataItem[] | null
  getSysConfigByKey: (configKey: string) => string | undefined
  initializeApp: () => Promise<void>
}

const initialState = {
  dictList: [],
  sysConfigList: [],
  loading: false,
}

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setDictList: (dictList: DictItem[]) => {
    set({ dictList })
  },

  setSysConfigList: (sysConfigList: SysConfigItem[]) => {
    set({ sysConfigList })
  },

  setLoading: (loading: boolean) => {
    set({ loading })
  },

  getDictList: async () => {
    try {
      set({ loading: true })
      const { data } = await getDictListApi()
      get().setDictList(data || [])
    } catch (error) {
      console.error('Get dict list error:', error)
    } finally {
      set({ loading: false })
    }
  },

  getSysConfigList: async () => {
    try {
      set({ loading: true })
      const { data } = await getSysConfigListApi()
      get().setSysConfigList(data || [])
    } catch (error) {
      console.error('Get sys config list error:', error)
    } finally {
      set({ loading: false })
    }
  },

  getDictByType: (dictType: string) => {
    const { dictList } = get()
    return dictList.filter(dict => dict.dictType === dictType)
  },

  // 根据字典类型获取字典数据
  getDictDataByType: async (dictType: string) => {
    try {
      const { data } = await dictDataApi.getByType(dictType)
      return data || []
    } catch (error) {
      console.error(`Get dict data by type ${dictType} error:`, error)
      return null
    }
  },

  getSysConfigByKey: (configKey: string) => {
    const { sysConfigList } = get()
    const config = sysConfigList.find(item => item.configKey === configKey)
    return config?.configValue
  },

  initializeApp: async () => {
    try {
      await Promise.all([
        get().getDictList(),
        get().getSysConfigList(),
      ])
    } catch (error) {
      console.error('Initialize app error:', error)
      throw error
    }
  },
}))