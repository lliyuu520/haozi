import type {App, Plugin} from 'vue'
import constant from '@/utils/constant'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import service from "@/utils/request";
import { reactive, ref } from 'vue'
import {UploadFile, UploadFiles, UploadRequestOptions} from "element-plus";
import axios from "axios";
import {ElMessage} from "element-plus/es";
import store from "@/store";

// 配置 Day.js
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

// 把路径转换成驼峰命名
export const pathToCamel = (path: string): string => {
	return path.replace(/\/(\w)/g, (all, letter) => letter.toUpperCase())
}

// 是否外链
export const isExternalLink = (url: string): boolean => {
	return /^(https?:|\/\/|http?:|\/\/|^{{\s?apiUrl\s?}})/.test(url)
}

// 替换外链参数
export const replaceLinkParam = (url: string): string => {
	return url.replace('{{apiUrl}}', constant.apiUrl)
}

// 转换文件大小格式
export const convertSizeFormat = (size: number): string => {
	const unit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
	let index = Math.floor(Math.log(size) / Math.log(1024))
	let newSize = size / Math.pow(1024, index)

	// 保留的小数位数
	return newSize.toFixed(2) + ' ' + unit[index]
}

// 获取svg图标(id)列表
export const getIconList = (): string[] => {
	const rs: string[] = []
	const list = document.querySelectorAll('svg symbol[id^="icon-"]')
	for (let i = 0; i < list.length; i++) {
		rs.push(list[i].id)
	}
	return rs
}

// 获取字典Label
export const getDictLabel = (dictList: any[], dictType: string, dictValue: string) => {
	const type = dictList.find((element: any) => element.dictType === dictType)
	if (type) {
		const val = type.dataList.find((element: any) => element.dictValue === dictValue + '')
		if (val) {
			return val.dictLabel
		} else {
			return dictValue
		}
	} else {
		return dictValue
	}
}

// 获取字典Label样式
export const getDictLabelClass = (dictList: any[], dictType: string, dictValue: string): string => {
	const type = dictList.find((element: any) => element.dictType === dictType)
	if (type) {
		const val = type.dataList.find((element: any) => element.dictValue === dictValue + '')
		if (val) {
			return val.labelClass
		} else {
			return ''
		}
	} else {
		return ''
	}
}

// 获取字典数据列表
export function getDictDataList(dictList: any[], dictType: string) {
	const type = dictList.find((element: any) => element.dictType === dictType)
	if (type) {
		return type.dataList
	} else {
		return []
	}
}
// 获取系统配置

export const useSysConfigApi = (code:string) => {
    const foundElement = store.appStore.sysConfigList.find((element: any) => element.code === code)
    return foundElement
}


// 全局组件安装
export const withInstall = <T>(component: T, alias?: string) => {
	const comp = component as any
	comp.install = (app: App) => {
		app.component(comp.name || comp.displayName || 'Component', component)
		if (alias) {
			app.config.globalProperties[alias] = component
		}
	}
	return component as T & Plugin
}



export interface ImageDTO {
    url: string
    name: string
}

export const dialogImageUrl = ref('')
export const imageUrlDialogVisible = ref(false)

export const handleRemove = (file: any, fileList: any) => {
    fileList.remove(file)
}

export const handleImageUrlPreview = (file: any) => {
    dialogImageUrl.value = file.url
    imageUrlDialogVisible.value = true
}

export const handleBeforeUpload = async (file: any) => {
    // 检查图片文件
    if (file.type.startsWith('image/')) {
        // 如果源文件>5MB，不允许上传
        if (file.size > 5 * 1024 * 1024) {
            ElMessage.error('图片文件大小不能超过5MB')
            return false
        }
    }
    return true
}


const ossPolicyUrl: string = '/sys/file/getOssPolicy'

export const initOssPolicy = (fileName: string) => {
    return service.get(ossPolicyUrl + '?fileName=' + fileName)
}

interface OssPolicy {
    accessKeyId: string
    host: string
    policy: string
    signature: string
    expire: number
    dir: string
    contentType: string
    contentDisposition: string
    fileUrl: string
    fileName: string
}
const ossPolicy = reactive({} as OssPolicy)
//  使用前端直传oss的方式上传图片
// 获取Oss上传签名
export const uploadOss = async (uploadRequestOptions: UploadRequestOptions) => {
    const file = uploadRequestOptions.file
    const fileName = file.name

    // 获取OSS上传签名
    try {
        const res = await initOssPolicy(fileName)
        Object.assign(ossPolicy, res.data)

        const formData = new FormData()
        formData.append('OSSAccessKeyId', ossPolicy.accessKeyId)
        formData.append('policy', ossPolicy.policy)
        formData.append('signature', ossPolicy.signature)
        formData.append('key', ossPolicy.dir + ossPolicy.fileName)
        formData.append('host', ossPolicy.host)
        formData.append('dir', ossPolicy.dir)
        formData.append('x-oss-content-type', ossPolicy.contentType)
        formData.append('success_action_status', '200')
        formData.append('Content-Disposition', ossPolicy.contentDisposition)
        formData.append('file', file)

        return new Promise((resolve, reject) => {
            axios
                .postForm(ossPolicy.host, formData)
                .then(res => {
                    uploadRequestOptions.onSuccess(ossPolicy.fileUrl)
                    ElMessage.success('上传成功')
                    resolve(ossPolicy.fileUrl)
                })
                .catch(err => {
                    reject(err)
                    ElMessage.error('上传失败')
                })
        })

    } catch (error) {
        console.error('获取OSS上传签名失败:', error)
        ElMessage.error('获取上传凭证失败，请重试')
        // 确保只调用一次错误回调
        if (uploadRequestOptions.onError) {
            // 创建一个符合UploadAjaxError接口的简单错误对象
            const uploadError = {
                name: 'UploadError',
                message: error instanceof Error ? error.message : '获取上传凭证失败',
                status: 0,
                method: 'POST',
                url: ossPolicyUrl
            } as any
            uploadRequestOptions.onError(uploadError)
        }
    }
}

export const handleUploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    console.log(response)
    uploadFile.url = response
}
// 1.千分值;2.2位小数;3.元结尾 30000.1=> 3,000.10元
export const formatYuan = (value: number): string => {
    if (value === undefined || value === null || isNaN(value)) {
        return '0.00'
    }
    const num = Number(value)
    const formatted = num.toFixed(2)
    const parts = formatted.split('.')
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const decimalPart = parts[1] || '00'
    return `${integerPart}.${decimalPart}`
}

// 分转元 1.千分值;2.2位小数;3.元结尾
export const formatFen = (value: number): string => {
    if (value === undefined || value === null || isNaN(value)) {
        return '0.00'
    }
    const yuanValue = Number(value) / 100
    const formatted = yuanValue.toFixed(2)
    const parts = formatted.split('.')
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const decimalPart = parts[1] || '00'
    return `${integerPart}.${decimalPart}`
}


interface AuditStatus{
    code: string
    desc: string
}
export const auditStatusList: AuditStatus[] = [
    {
        code: 'UNAUDITED',
        desc: '待审核'
    },
    {
        code: 'PASS',
        desc: '通过'
    },
    {
        code: 'REJECT',
        desc: '拒绝'
    }
]

export const filterAuditStatusDesc = (code: string): string => {
    const auditStatus = auditStatusList.find(item => item.code === code)
    return auditStatus ? auditStatus.desc : ''
}


