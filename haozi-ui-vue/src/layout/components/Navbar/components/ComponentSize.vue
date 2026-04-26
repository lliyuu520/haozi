<template>
	<el-dropdown trigger="click" @command="componentSizeChange">
		<svg-icon icon="icon-font-size"></svg-icon>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item command="large" :disabled="componentSize === 'large'">大</el-dropdown-item>
				<el-dropdown-item command="default" :disabled="componentSize === 'default'">默认</el-dropdown-item>
				<el-dropdown-item command="small" :disabled="componentSize === 'small'">小</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import store from '@/store'
import {computed} from 'vue'
import SvgIcon from '@/components/svg-icon/src/svg-icon.vue'

const componentSize = computed(() => store.appStore.componentSize)
const componentSizeChange = (size: string) => {
	store.appStore.setComponentSize(size)
}
</script>
