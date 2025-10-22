export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  limit: number
}
