<template>
	<el-config-provider :size="size">
		<router-view />
	</el-config-provider>
</template>

<script lang="ts" setup>
import store from "@/store";
import {handleThemeStyle} from "@/utils/theme";
import {useTitle} from "@vueuse/core";
import {computed, nextTick, onMounted} from "vue";
import {RouterView} from "vue-router";

const size = computed(() => store.appStore.componentSize)

// 设置标题
useTitle('槟界')

onMounted(() => {
	nextTick(() => {
		// 初始化主题样式
		handleThemeStyle(store.appStore.theme)
	})
})
</script>
<style lang="scss">
.el-form--inline {
  .el-form-item {
    & > .el-input,
    + .el-cascader,
    .el-select,
    .el-date-editor,
    .el-autocomplete {
      width: 240px;
    }
  }
}
</style>
