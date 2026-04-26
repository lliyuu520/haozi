import service from "@/utils/request";

const baseUrl = '/sys/log'
export  const useLogApi = (id: string) => {
  return service.get(baseUrl+"/info?id=" + id)
}
