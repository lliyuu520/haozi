import service from '@/utils/request'

/**
 * 系统参数 API
 */
export const useSysConfigApi = (id: number) => {
  return service.get('/sys/config/info', { params: { id } })
}

export const useSysConfigSubmitApi = (dataForm: any) => {
  if (dataForm.id) {
    return service.put('/sys/config', dataForm)
  } else {
    return service.post('/sys/config', dataForm)
  }
}

export const useSysConfigDeleteApi = (id: number) => {
  return service.delete('/sys/config', { params: { id } })
}

export const useSysConfigDeleteBatchApi = (idList: number[]) => {
  return service.delete('/sys/config', { data: idList })
}

export const useSysConfigByCodeApi = (code: string) => {
  return service.get(`/sys/config/code/${code}`)
}

export const useSysConfigListApi = () => {
  return service.get('/sys/config/list' )
}