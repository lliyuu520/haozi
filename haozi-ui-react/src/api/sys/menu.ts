import service from '@/utils/request'
import type {SysMenu, SysMenuQuery} from '@/types/sys/menu'

// 获取导航菜单和权限
export const getMenuNavApi = () => {
  return service.get<{
    navList: SysMenu[]
    authorityList: string[]
  }>('/sys/menu/nav')
}

// 获取菜单列表
export const getSysMenuListApi = (params?: SysMenuQuery) => {
  return service.get<any[]>('/sys/menu/list', {
    params: params?.type !== undefined ? { type: params.type } : undefined
  })
}

// 获取菜单树（复用列表接口）
export const getSysMenuTreeApi = () => {
  return service.get<any[]>('/sys/menu/list')
}

// 获取菜单详情
export const getSysMenuInfoApi = (id: string) => {
  return service.get<SysMenu>(`/sys/menu/${id}`)
}

// 新增菜单
export const createSysMenuApi = (data: SysMenu) => {
  return service.post('/sys/menu', data)
}

// 更新菜单
export const updateSysMenuApi = (data: SysMenu) => {
  return service.put('/sys/menu', data)
}

// 删除菜单
export const deleteSysMenuApi = (id: string) => {
  return service.delete(`/sys/menu?id=${id}`)
}

// 修改菜单状态（后端暂无此接口）
// export const changeSysMenuStatusApi = (id: string, status: number) => {
//   return service.put('/sys/menu/status', { id, status })
// }