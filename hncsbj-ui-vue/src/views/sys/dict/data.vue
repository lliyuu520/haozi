<template>
	<el-dialog v-model="dictDataVisible" title="字典配置" width="800px">
		<el-form :inline="true" :model="state.queryForm">
			<el-form-item>
				<el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			border
			style="width: 100%"
			@selection-change="selectionChangeHandle"
			@sort-change="sortChangeHandle"
		>
			<el-table-column prop="dictValue" label="字典值" header-align="center" align="center"></el-table-column>
			<el-table-column prop="dictLabel" label="字典标签" header-align="center" align="center"> </el-table-column>
			<el-table-column prop="weight" label="排序" header-align="center" align="center"> </el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button type="primary" link @click="deleteHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
		<!-- 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-dialog>
</template>

<script setup lang="ts">
import {useCrud} from '@/hooks'
import {reactive, ref} from 'vue'
import AddOrUpdate from './data-add-or-update.vue'
import {IHooksOptions} from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/dict/data/page',
	deleteUrl: '/sys/dict/data',
	queryForm: {
		dictType: ''
	}
})
const dictDataVisible = ref(false)

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: Number) => {
	addOrUpdateRef.value.dataForm.dictType = state.queryForm.dictType
	addOrUpdateRef.value.init(id)
}

const { getDataList, sizeChangeHandle, selectionChangeHandle, sortChangeHandle, currentChangeHandle, deleteHandle } = useCrud(state)

const init = (dictType: string) => {
  dictDataVisible.value = true
  state.queryForm.dictType = dictType
  getDataList()
}

defineExpose({
  init
})
</script>
