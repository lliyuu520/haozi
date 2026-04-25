<template>
	<el-radio-group :model-value="modelValue + ''" @change="$emit('update:modelValue', $event)">
		<el-radio v-for="data in dataList" :key="data.dictValue" :value="data.dictValue">{{ data.dictLabel }}</el-radio>
	</el-radio-group>
</template>

<script lang="ts" name="FastRadioGroup" setup>
import store from "@/store";
import {getDictDataList} from "@/utils/tool";

const props = defineProps({
	modelValue: {
		type: [Number, String],
		required: true
	},
	dictType: {
		type: String,
		required: true
	}
})

const dataList = getDictDataList(store.appStore.dictList, props.dictType)
</script>
