export const DEFAULT_ORDER_TYPE = 'PACKAGE'
export const ORDER_TYPE_OPTIONS = [
	{ label: '扫码', value: 'PACKAGE' },
	{ label: '卡片', value: 'CARD' }
]
export const getOrderTypeLabel = (value?: string) => {
	const targetValue = value || DEFAULT_ORDER_TYPE
	return ORDER_TYPE_OPTIONS.find(item => item.value === targetValue)?.label || '-'
}
