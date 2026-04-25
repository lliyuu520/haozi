<template>
	<el-scrollbar>
		<el-main class="layout-main">
			<el-scrollbar class="layout-scrollbar">
				<div class="layout-card" :style="layoutMainHeight">
					<router-view v-slot="{ Component, route }">
						<keep-alive v-if="theme.isTabsCache" :include="[...store.tabsStore.cachedViews]">
							<component :is="Component" :key="route.name" v-if="Component" />
						</keep-alive>
						<component :is="Component" v-else :key="route.name" v-if="Component" />
					</router-view>
				</div>
			</el-scrollbar>
		</el-main>
	</el-scrollbar>
</template>

<script setup lang="ts">
import store from '@/store'
import {computed} from 'vue'
import {RouterView} from 'vue-router'

const theme = computed(() => store.appStore.theme)
const layoutMainHeight = computed(() => {
	if (!theme.value.isTabsView) {
		return 'min-height: calc(100vh - var(--theme-header-height) - 30px) !important'
	} else {
		return ''
	}
})
</script>

<style lang="scss" scoped>
.layout-main {
	padding: 0;
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 100%;
}

.layout-scrollbar {
	height: 100%;
}

.layout-card {
	background-color: var(--el-bg-color);
	border-radius: 4px;
	box-sizing: border-box;
	padding: 10px;
	height: 100%;
}
</style>
