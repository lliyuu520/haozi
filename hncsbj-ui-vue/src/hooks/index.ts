import {IHooksOptions} from '@/hooks/interface'
import service from '@/utils/request'
import {getCurrentInstance, onDeactivated, onMounted, onUnmounted, toRaw, watch} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {listenDownloadNotifications, closeSSEConnection} from '@/utils/sse'
import {useRoute} from 'vue-router'

const CRUD_CACHE_PREFIX = 'crud-cache:'

export const useCrud = (options: IHooksOptions) => {
  const defaultOptions: IHooksOptions = {
    createdIsNeed: true,
    dataListUrl: '',
    cacheKey: '',
    isPage: true,
    deleteUrl: '',
    primaryKey: 'id',
    exportUrl: '',
    queryForm: {},
    dataList: [],
    order: '',
    asc: false,
    page: 1,
    limit: 10,
    total: 0,
    pageSizes: [1, 10, 20, 50, 100, 200],
    dataListLoading: false,
    dataListSelections: []
  }

  const mergeDefaultOptions = (defaults: any, target: any): IHooksOptions => {
    for (const key in defaults) {
      if (!Object.getOwnPropertyDescriptor(target, key)) {
        target[key] = defaults[key]
      }
    }
    return target
  }

  const state = mergeDefaultOptions(defaultOptions, options)

  const canUseSessionStorage = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
  const currentInstance = getCurrentInstance()
  const route = currentInstance ? useRoute() : undefined
  const rawCacheKey =
    (state.cacheKey && state.cacheKey.trim()) ||
    (route?.name ? String(route.name) : '') ||
    (route?.path ?? '') ||
    (state.dataListUrl ?? '')
  const storageKey = canUseSessionStorage && rawCacheKey ? `${CRUD_CACHE_PREFIX}${rawCacheKey}` : ''

  const restoreCacheState = () => {
    if (!storageKey) {
      return
    }
    try {
      const cache = window.sessionStorage.getItem(storageKey)
      if (!cache) {
        return
      }
      const parsed = JSON.parse(cache)
      if (state.isPage !== false) {
        if (typeof parsed.page === 'number') {
          state.page = parsed.page
        }
        if (typeof parsed.limit === 'number') {
          state.limit = parsed.limit
        }
      }
      if (typeof parsed.order === 'string') {
        state.order = parsed.order
      }
      if (typeof parsed.asc === 'boolean') {
        state.asc = parsed.asc
      }
      if (parsed.queryForm && typeof parsed.queryForm === 'object') {
        state.queryForm = {
          ...state.queryForm,
          ...parsed.queryForm
        }
      }
    } catch (error) {
      console.warn('恢复 CRUD 缓存状态失败:', error)
    }
  }

  const persistCacheState = () => {
    if (!storageKey) {
      return
    }
    try {
      const payload = {
        page: state.page,
        limit: state.limit,
        order: state.order,
        asc: state.asc,
        queryForm: toRaw(state.queryForm) ?? {}
      }
      window.sessionStorage.setItem(storageKey, JSON.stringify(payload))
    } catch (error) {
      console.warn('持久化 CRUD 缓存状态失败:', error)
    }
  }

  restoreCacheState()

  if (storageKey) {
    watch(
      () => ({
        page: state.page,
        limit: state.limit,
        order: state.order,
        asc: state.asc,
        queryForm: state.queryForm
      }),
      () => {
        persistCacheState()
      },
      {deep: true}
    )

    onDeactivated(() => {
      persistCacheState()
    })
  }

  onMounted(() => {
    if (state.createdIsNeed) {
      query()
    }
  })

  const resetQueryForm = () => {
    state.queryForm = {}
  }

  const query = () => {
    if (!state.dataListUrl) {
      return
    }

    state.dataListLoading = true

    service
      .get(state.dataListUrl, {
        params: {
          order: state.order,
          asc: state.asc,
          page: state.isPage ? state.page : null,
          limit: state.isPage ? state.limit : null,
          ...state.queryForm
        }
      })
      .then((res: any) => {
        state.dataList = state.isPage ? res.data.list : res.data
        state.total = state.isPage ? res.data.total : 0
      })
      .finally(() => {
        state.dataListLoading = false
      })
  }

  const getDataList = () => {
    query()
  }

  const sizeChangeHandle = (val: number) => {
    state.page = 1
    state.limit = val
    query()
  }

  const currentChangeHandle = (val: number) => {
    state.page = val
    query()
  }

  const selectionChangeHandle = (selections: any[]) => {
    state.dataListSelections = selections.map((item: any) => state.primaryKey && item[state.primaryKey])
  }

  const sortChangeHandle = (data: any) => {
    const {prop, order} = data

    if (prop && order) {
      state.order = prop
      state.asc = order === 'ascending'
    } else {
      state.order = ''
    }

    query()
  }

  const deleteHandle = (key: number | string) => {
    if (!state.deleteUrl) {
      return
    }

    ElMessageBox.confirm('确定要删除该条数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        service.delete(state.deleteUrl + '?id=' + key).then(() => {
          ElMessage.success('删除成功')

          query()
        })
      })
      .catch(() => {})
  }

  const downloadHandle = (url: string) => {
    window.open(url)
  }

  const exportExcelHandle = () => {
    if (!state.exportUrl) {
      return
    }

    listenDownloadNotifications()

    service
      .get(state.exportUrl, {
        params: {
          order: state.order,
          asc: state.asc,
          page: state.isPage ? state.page : null,
          limit: state.isPage ? state.limit : null,
          ...state.queryForm
        }
      })
      .then(() => {
        ElMessage.success('文件生成中，请稍后...')
      })
      .catch(error => {
        ElMessage.error('导出失败，请重试')
        console.error('导出失败:', error)
      })
  }

  onUnmounted(() => {
    persistCacheState()
    closeSSEConnection()
  })

  return {
    getDataList,
    sizeChangeHandle,
    currentChangeHandle,
    selectionChangeHandle,
    sortChangeHandle,
    deleteHandle,
    downloadHandle,
    resetQueryForm,
    exportExcelHandle
  }
}
