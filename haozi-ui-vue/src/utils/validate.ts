export const isExternalLink = (path: string): boolean => {
	return /^(https?:|mailto:|tel:)/.test(path)
}

export const validatePassword = (rule: any, value: any, callback: (e?: string) => any) => {
	if (value.length < 4) {
		callback('密码最低4位')
	} else {
		callback()
	}
}

export const validateMobile = (mobile: string): boolean => {
	return /^1[3456789]\d{9}$/.test(mobile)
}
