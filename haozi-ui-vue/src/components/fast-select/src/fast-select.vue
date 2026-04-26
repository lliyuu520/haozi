<template>
	<el-select 
		clearable
		:model-value="getModelValue" 
		:placeholder="props.placeholder || '请选择'" 
		@change="handleChange"
		@clear="handleClear"
	>
		<el-option v-for="data in dataList" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue">
			{{ data.dictLabel }}
		</el-option>
	</el-select>
</template>

<script lang="ts" name="FastSelect" setup>
import { computed } from 'vue'
import store from "@/store";
import {getDictDataList} from "@/utils/tool";

const props = withDefaults(defineProps<{
	modelValue: number | string | null | undefined
	dictType: string
	placeholder?: string
}>(), {
  placeholder: '请选择',
})

const dataList = getDictDataList(store.appStore.dictList, props.dictType)

// 计算属性：处理 modelValue
const getModelValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) {
    return undefined
  }
  return props.modelValue
})

// 事件处理
const emit = defineEmits(['update:modelValue'])

const handleChange = (value: string | number) => {
  emit('update:modelValue', value)
}

const handleClear = () => {
  emit('update:modelValue', undefined)
}
</script>
