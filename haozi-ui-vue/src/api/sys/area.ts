import service from '@/utils/request'

/**
 * 根据父级编码获取子节点列表（或顶级节点）
 * @param parentCode 父级编码，顶级节点可以传空或特定根编码 (如 '0' 或 'ROOT')
 * @returns 
 */
export const useSysAreaNodeListApi = (parentCode: string) => {
	return service.get(`/sys/area/topNodeList/${parentCode}`)
}

/**
 * 获取所有行政区域节点
 * @returns 
 */
export const useSysAreaAllNodeApi = () => {
	return service.get('/sys/area/allNode')
}

/**
 * 刷新行政区域缓存
 */
export const useSysAreaRefreshCacheApi = () => {
	return service.post('/sys/area/refreshCache')
}

/**
 * 保存行政区域节点
 * @param data 
 * @returns 
 */
export const useSysAreaSaveApi = (data: any) => {
	return service.post('/sys/area/saveOne', data)
}

/**
 * 更新行政区域节点
 * @param data 
 * @returns 
 */
export const useSysAreaUpdateApi = (data: any) => {
	return service.post('/sys/area/updateOne', data)
}

/**
 * 删除行政区域节点
 * @param code 
 * @returns 
 */
export const useSysAreaDeleteApi = (code: string) => {
	return service.post(`/sys/area/deleteOne/${code}`)
}
