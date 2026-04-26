<template>
	<el-breadcrumb :separator-icon="ArrowRight" class="navbar-breadcrumb" separator="/">
		<el-breadcrumb-item key="home">
			<span>主页</span>
		</el-breadcrumb-item>
		<el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
			<span>{{ item }}</span>
		</el-breadcrumb-item>
	</el-breadcrumb>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {ArrowRight} from "@element-plus/icons-vue";
import {computed} from "vue";

const route = useRoute()
const breadcrumb = computed(() => route.meta.breadcrumb)
</script>

<style lang="scss" scoped>
.navbar-breadcrumb {
	:deep(.el-breadcrumb__inner) {
		color: var(--theme-header-text-color) !important;
	}
	padding-left: 10px;
}
</style>
