<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item label="操作人">
				<el-input v-model="state.queryForm.operatorName" clearable></el-input>
			</el-form-item>
			<el-form-item label="操作类型">
				<el-input v-model="state.queryForm.typeName" clearable></el-input>
			</el-form-item>
			<el-form-item label="操作模块">
				<el-input v-model="state.queryForm.moduleName" clearable></el-input>
			</el-form-item>
			<el-form-item label="操作时间">
				<el-date-picker
					v-model="state.queryForm.operateTime"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="YYYY-MM-DD"
					clearable
				></el-date-picker>
			</el-form-item>
			<el-form-item label="响应状态">
				<el-select v-model="state.queryForm.status" clearable placeholder="请选择">
					<el-option label="成功" :value="0"></el-option>
					<el-option label="失败" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
				<el-button @click="resetQuery()">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column align="center" header-align="center" label="操作人" prop="operatorName" width="120"></el-table-column>
			<el-table-column align="center" header-align="center" label="操作类型" prop="typeName" width="100"></el-table-column>
			<el-table-column align="center" header-align="center" label="操作模块" prop="moduleName" width="120"></el-table-column>
			<el-table-column align="center" header-align="center" label="操作时间" prop="operateTime" width="100"></el-table-column>
			<el-table-column align="center" header-align="center" label="响应状态" width="100">
				<template #default="scope">
					<el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
						{{ scope.row.status === 0 ? '成功' : '失败' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="请求参数" prop="requestParams" show-overflow-tooltip></el-table-column>
			<el-table-column align="center" header-align="center" label="响应内容" prop="responseResult" show-overflow-tooltip></el-table-column>
			<el-table-column align="center" fixed="right" header-align="center" label="操作" width="150">
				<template #default="scope">
					<el-button link type="primary" @click="addOrUpdateHandle(scope.row.id)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-size="state.limit"
			:page-sizes="state.pageSizes"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script lang="ts" setup>
import {useCrud} from "@/hooks";
import {IHooksOptions} from "@/hooks/interface";
import {reactive, ref} from "vue";
import AddOrUpdate from "./add-or-update.vue";

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/log/page',
	queryForm: {
		operatorName: '',
		typeName: '',
		moduleName: '',
		operateTime: [],
		status: undefined
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const resetQuery = () => {
	state.queryForm = {
		operatorName: '',
		typeName: '',
		moduleName: '',
		operateTime: [],
		status: undefined
	}
	getDataList()
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteHandle } = useCrud(state)
</script>
