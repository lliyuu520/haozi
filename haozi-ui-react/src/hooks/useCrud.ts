import {useCallback, useEffect, useState} from 'react'
import {message} from 'antd'
import service from '@/utils/request'

export interface CrudOptions {
  dataListUrl: string
  deleteUrl?: string
  queryForm?: Record<string, any>
  isPage?: boolean
  primaryKey?: string
  exportUrl?: string
  pageSizes?: number[]
  order?: string
  asc?: boolean
}

export interface CrudState {
  dataList: any[]
  loading: boolean
  page: number
  limit: number
  total: number
  pageSizes: number[]
  dataListSelections: any[]
  queryForm: Record<string, any>
  order: string
  asc: boolean
}

const defaultOptions: Partial<CrudOptions> = {
  isPage: true,
  primaryKey: 'id',
  pageSizes: [10, 20, 50, 100, 200],
  order: '',
  asc: false,
}

export const useCrud = (options: CrudOptions) => {
  const mergedOptions = { ...defaultOptions, ...options }

  const [state, setState] = useState<CrudState>({
    dataList: [],
    loading: false,
    page: 1,
    limit: 10,
    total: 0,
    pageSizes: mergedOptions.pageSizes!,
    dataListSelections: [],
    queryForm: mergedOptions.queryForm || {},
    order: mergedOptions.order!,
    asc: mergedOptions.asc!,
  })

  const query = useCallback(async () => {
    if (!mergedOptions.dataListUrl) return

    setState(prev => ({ ...prev, loading: true }))

    try {
      const params: any = {
        order: state.order,
        asc: state.asc,
        page: mergedOptions.isPage ? state.page : undefined,
        limit: mergedOptions.isPage ? state.limit : undefined,
        ...state.queryForm,
      }

      // 过滤掉空值
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined || params[key] === null) {
          delete params[key]
        }
      })

      const response = await service.get(mergedOptions.dataListUrl, { params })

      if (mergedOptions.isPage) {
        setState(prev => ({
          ...prev,
          dataList: response.data.list || [],
          total: response.data.total || 0,
        }))
      } else {
        setState(prev => ({
          ...prev,
          dataList: response.data || [],
        }))
      }
    } catch (error) {
      console.error('Query failed:', error)
      setState(prev => ({ ...prev, dataList: [], total: 0 }))
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [mergedOptions, state.page, state.limit, state.order, state.asc, state.queryForm])

  // 获取数据列表
  const getDataList = useCallback(() => {
    setState(prev => ({ ...prev, page: 1 }))
    query()
  }, [query])

  // 重置查询表单
  const resetQueryForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      queryForm: mergedOptions.queryForm || {},
      page: 1,
    }))
    // 使用setTimeout确保状态更新后再执行查询
    setTimeout(query, 0)
  }, [mergedOptions.queryForm, query])

  // 页码改变
  const currentChangeHandle = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }))
    query()
  }, [query])

  // 每页条数改变
  const sizeChangeHandle = useCallback((limit: number) => {
    setState(prev => ({ ...prev, page: 1, limit }))
    query()
  }, [query])

  // 多选
  const selectionChangeHandle = useCallback((selections: any[]) => {
    setState(prev => ({
      ...prev,
      dataListSelections: selections.map(item => item[mergedOptions.primaryKey!]),
    }))
  }, [mergedOptions.primaryKey])

  // 排序
  const sortChangeHandle = useCallback((data: any) => {
    const { prop, order } = data
    setState(prev => ({
      ...prev,
      order: prop || '',
      asc: order === 'ascend',
    }))
    query()
  }, [query])

  // 删除
  const deleteHandle = useCallback(async (key: number | string) => {
    if (!mergedOptions.deleteUrl) return

    try {
      await service.delete(`${mergedOptions.deleteUrl}?id=${key}`)
      message.success('删除成功')
      query()
    } catch (error) {
      console.error('Delete failed:', error)
      message.error('删除失败')
    }
  }, [mergedOptions.deleteUrl, query])

  // 导出Excel
  const exportExcelHandle = useCallback(() => {
    if (!mergedOptions.exportUrl) return

    // 这里可以实现导出逻辑
    window.open(`${mergedOptions.exportUrl}?${new URLSearchParams({
      order: state.order,
      asc: state.asc.toString(),
      page: mergedOptions.isPage ? state.page.toString() : '',
      limit: mergedOptions.isPage ? state.limit.toString() : '',
      ...state.queryForm,
    }).toString()}`)
  }, [mergedOptions.exportUrl, state])

  // 初始化时自动查询
  useEffect(() => {
    query()
  }, [])

  return {
    state,
    getDataList,
    resetQueryForm,
    currentChangeHandle,
    sizeChangeHandle,
    selectionChangeHandle,
    sortChangeHandle,
    deleteHandle,
    exportExcelHandle,
    query,
  }
}