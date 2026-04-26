import service from '@/utils/request'



export const useAddDownloadTimesApi = (id: number) => {
  return service.post(`/sys/download-center/add-download-times/${id}`)
}
