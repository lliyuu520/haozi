<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
			<el-form-item>
				<el-input v-model="state.queryForm.dictType" placeholder="字典类型" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.dictName" placeholder="字典名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList">查询</el-button>
			</el-form-item>
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
			<el-table-column prop="dictType" label="字典类型" header-align="center" align="center"> </el-table-column>
			<el-table-column prop="dictName" label="字典名称" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button type="primary" link @click="showDictDataHandle(scope.row)">字典配置</el-button>
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
		<!-- 字典配置 -->
		<dict-data  ref="dictDataRef"></dict-data>
	</el-card>
</template>

<script setup lang="ts">
import {useCrud} from '@/hooks'
import {reactive, ref} from 'vue'
import AddOrUpdate from './type-add-or-update.vue'
import DictData from './data.vue'
import {IHooksOptions} from '@/hooks/interface'

const emit = defineEmits(['refreshDataList'])

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/dict/type/page',
	deleteUrl: '/sys/dict/type',
	queryForm: {
		dictName: '',
		dictType: ''
	}
})

const showDictDataHandle = (row: any) => {
  dictDataRef.value.init(row.dictType)

}
const dictDataRef  = ref()

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: Number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, sizeChangeHandle, selectionChangeHandle, sortChangeHandle, currentChangeHandle, deleteHandle } = useCrud(state)
</script>
