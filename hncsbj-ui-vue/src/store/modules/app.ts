import {defineStore} from 'pinia'
import {ITheme} from '@/store/theme/interface'
import cache from '@/utils/cache'
import {useDictTypeAllApi} from "@/api/sys/dict";
import {useSysConfigListApi} from "@/api/sys/config";


interface SysConfig{
    code:string;
    text:string;
    type:string;
    enabled:boolean;
    num:number;

}

export const appStore = defineStore('appStore', {
	state: () => ({
		// sidebar 是否展开
		sidebarOpened: cache.getSidebarOpened(),
		// 国际化
		language: cache.getLanguage(),
		// 组件大小
		componentSize: cache.getComponentSize(),
		// 字典列表
		dictList: [],
        // 系统配置
        sysConfigList:[] as SysConfig[],
		// 主题
		theme: cache.getTheme()
	}),
	actions: {
		setSidebarOpened() {
			this.sidebarOpened = !this.sidebarOpened
			cache.setSidebarOpened(this.sidebarOpened)
		},
		setSidebarStatus(status: boolean) {
			this.sidebarOpened = status
			cache.setSidebarOpened(this.sidebarOpened)
		},
		setComponentSize(size: string) {
			this.componentSize = size
			cache.setComponentSize(size)
		},
		setTheme(theme: ITheme) {
			this.theme = theme
			cache.setTheme(theme)
		},
		async getDictListAction() {
			const { data } = await useDictTypeAllApi()
			this.dictList = data || []
		},
        async getSysConfigListAction() {
            const { data } = await useSysConfigListApi()
            this.sysConfigList = data || []
        }
	}
})
