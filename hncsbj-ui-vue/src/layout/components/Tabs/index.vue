<template>
	<div class="tabs-container">
		<div class="tabs-item">
			<el-tabs v-model="activeTabName" :class="tabsStyleClass" @tab-click="tabClick" @tab-remove="tabRemove">
				<el-tab-pane
					v-for="tab in store.tabsStore.visitedViews"
					:key="tab"
					:closable="!isAffix(tab)"
					:label="tab.title"
					:name="tab.path"
				></el-tab-pane>
			</el-tabs>
		</div>
		<el-dropdown class="tabs-action" placement="bottom-end" trigger="click" @command="onClose">
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item :icon="Close" command="close">关闭</el-dropdown-item>
					<el-dropdown-item :icon="CircleClose" command="closeOthers">关闭其他</el-dropdown-item>
					<el-dropdown-item :icon="CircleCloseFilled" command="closeAll">关闭所有</el-dropdown-item>
				</el-dropdown-menu>
			</template>
			<el-icon><arrow-down /></el-icon>
		</el-dropdown>
	</div>
</template>

<script lang="ts" setup>
import store from "@/store";
import {closeAllTabs, closeOthersTabs, closeTab} from "@/utils/tabs";
import {ArrowDown, CircleClose, CircleCloseFilled, Close} from "@element-plus/icons-vue";
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

const activeTabName = ref(route.path)
const tabsStyleClass = computed(() => 'tabs-item-' + store.appStore.theme.tabsStyle)

// 是否固定
const isAffix = (tab: any) => {
	return tab.meta && tab.meta.affix
}

// 初始化固定tab
const initTabs = () => {
	try {
		const affixTabs = getAffixTabs(store.routerStore.routes)
		for (const tab of affixTabs) {
			// 需要有tab名称
			if (tab.name) {
				store.tabsStore.addView(tab)
			}
		}
	} catch (error) {
		console.error('Failed to initialize tabs:', error)
	}
}

// 获取需要固定的tabs
const getAffixTabs = (routes: any) => {
	let tabs: any[] = []
	routes.forEach((route: any) => {
		if (route.meta && route.meta.affix) {
			tabs.push({
				fullPath: route.path,
				path: route.path,
				name: route.name,
				meta: { ...route.meta }
			})
		}
		if (route.children) {
			const tempTabs = getAffixTabs(route.children)
			if (tempTabs.length >= 1) {
				tabs = [...tabs, ...tempTabs]
			}
		}
	})
	return tabs
}

// 添加tab
const addTab = () => {
	try {
		store.tabsStore.addView(route)
		store.tabsStore.addCachedView(route)
		activeTabName.value = route.path
	} catch (error) {
		console.error('Failed to add tab:', error)
	}
}

// tab被选中
const tabClick = (tab: any) => {
	try {
		if (tab.props.name) {
			router.push(tab.props.name).catch(err => {
				console.warn('Navigation failed:', err)
			})
		}
	} catch (error) {
		console.error('Tab click failed:', error)
	}
}

// 点击关闭tab
const tabRemove = (name: string | number) => {
	try {
		const tab = store.tabsStore.visitedViews.filter((tab: any) => tab.path === name)
		if (tab.length > 0) {
			closeTab(router, tab[0])
		}
	} catch (error) {
		console.error('Failed to remove tab:', error)
	}
}

// dropdown 关闭事件
const onClose = (type: string) => {
	try {
		switch (type) {
			case 'close':
				closeTab(router, route)
				break
			case 'closeOthers':
				closeOthersTabs(router, route)
				break
			case 'closeAll':
				closeAllTabs(router, route)
				break
		}
	} catch (error) {
		console.error('Failed to close tab:', error)
	}
}

// 在 setup 中注册生命周期钩子
onMounted(() => {
	// 初始化
	initTabs()
	addTab()
})

// 监听路由变化
watch(route, () => {
	// 当前路由，添加到tabs里
	if (route.name) {
		addTab()
	}
}, { immediate: true })
</script>

<style lang="scss" scoped>
.tabs-container {
	display: flex;
	position: relative;
	z-index: 6;
	height: 40px;
	background-color: #fff;
	.tabs-item {
		transition: left 0.3s;
		flex-grow: 1;
		overflow: hidden;
		:deep(.el-tabs__nav-prev) {
			padding: 0 10px;
			border-right: var(--el-border-color-extra-light) 1px solid;
		}
		:deep(.el-tabs__nav-next) {
			padding: 0 10px;
			border-left: var(--el-border-color-extra-light) 1px solid;
		}
		:deep(.is-scrollable) {
			padding: 0 32px;
		}
		:deep(.el-tabs__active-bar) {
			height: 0;
		}
		:deep(.el-tabs__item) {
			.is-icon-close {
				transition: none !important;
				&:hover {
					color: var(--el-color-primary-light-9);
					background-color: var(--el-color-primary);
					border-radius: 50%;
				}
			}
		}
	}
}
.tabs-item-style-1 {
	:deep(.el-tabs__item) {
		padding: 0 15px !important;
		border-right: var(--el-border-color-extra-light) 1px solid;
		user-select: none;
		color: #8c8c8c;
		&:hover {
			color: #444;
			background: rgba(0, 0, 0, 0.02);
		}
		&.is-active {
			color: var(--el-color-primary);
			background-color: var(--el-color-primary-light-9);
			border-bottom: var(--el-border-color-light) 2px solid;
			&:before {
				background-color: var(--el-color-primary);
			}
		}
		&:before {
			content: '';
			width: 9px;
			height: 9px;
			margin-right: 8px;
			display: inline-block;
			background-color: #ddd;
			border-radius: 50%;
		}
	}
}
.tabs-item-style-2 {
	:deep(.el-tabs__item) {
		padding: 0 15px !important;
		border-right: none;
		user-select: none;
		color: #8c8c8c;
		display: inline-block;

		&:hover {
			color: #444;
			background: rgba(0, 0, 0, 0.02);
			border-bottom: var(--el-color-primary) 2px solid;
		}

		&.is-active {
			color: var(--el-color-primary) !important;
			background-color: var(--el-color-primary-light-9) !important;
			border-bottom: var(--el-color-primary) 2px solid;
			&:before {
				background-color: var(--el-color-primary);
			}
		}
	}
}
.tabs-action {
	height: 40px;
	line-height: 40px;
	box-sizing: border-box;
	padding: 0 12px;
	align-items: center;
	cursor: pointer;
	color: #666;
	border-left: var(--el-border-color-extra-light) 1px solid;
	border-bottom: var(--el-border-color-light) 2px solid;
}
</style>
