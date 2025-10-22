import {useMemo} from 'react'
import {useAppStore} from '@/stores/appStore'
import type {DictDataItem} from '@/types/sys/dict'

/**
 * 字典数据Hook
 * @param dictType 字典类型
 * @returns 字典数据和工具函数
 */
export const useDict = (dictType: string) => {
  const { getDictDataByType } = useAppStore()

  const getDictLabel = (dictValue: string, dictDataList: DictDataItem[]): string => {
    const item = dictDataList.find(item => item.dictValue === dictValue)
    return item?.dictLabel || dictValue
  }

  const getDictValue = (dictLabel: string, dictDataList: DictDataItem[]): string => {
    const item = dictDataList.find(item => item.dictLabel === dictLabel)
    return item?.dictValue || dictLabel
  }

  const getDictOptions = (dictDataList: DictDataItem[]) => {
    return dictDataList
      .filter(item => item.status === 1) // 只取启用状态的
      .map(item => ({
        label: item.dictLabel,
        value: item.dictValue,
        key: item.id,
        sort: item.dictSort
      }))
      .sort((a, b) => a.sort - b.sort) // 按排序号排序
  }

  return {
    // 异步获取字典数据
    getDictData: () => getDictDataByType(dictType),

    // 工具函数（需要传入字典数据列表）
    getDictLabel,
    getDictValue,
    getDictOptions
  }
}

/**
 * 预加载字典数据的Hook
 * @param dictType 字典类型
 * @param dictDataList 字典数据列表
 * @returns 字典工具函数
 */
export const useDictData = (dictType: string, dictDataList: DictDataItem[] = []) => {
  const utils = useDict(dictType)

  const getDictLabel = (dictValue: string) => {
    return utils.getDictLabel(dictValue, dictDataList)
  }

  const getDictValue = (dictLabel: string) => {
    return utils.getDictValue(dictLabel, dictDataList)
  }

  const options = useMemo(() => {
    return utils.getDictOptions(dictDataList)
  }, [dictDataList, utils])

  return {
    getDictLabel,
    getDictValue,
    options
  }
}
