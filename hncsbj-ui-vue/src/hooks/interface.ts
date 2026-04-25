export interface IHooksOptions {
	// auto request list data when component created
	createdIsNeed?: boolean
	// list endpoint
	dataListUrl?: string
	// optional cache key for preserving query state
	cacheKey?: string
	// enable pagination
	isPage?: boolean
	// delete endpoint
	deleteUrl?: string
	// primary key field
	primaryKey?: string
	// export endpoint
	exportUrl?: string
	// query form payload
	queryForm?: any
	// list data
	dataList?: any[]
	// sort field
	order?: string
	// ascending flag
	asc?: boolean
	// current page
	page?: number
	// page size
	limit?: number
	// total items
	total?: number
	pageSizes?: number[]
	// loading state
	dataListLoading?: boolean
	// selected items
	dataListSelections?: any[]
}
