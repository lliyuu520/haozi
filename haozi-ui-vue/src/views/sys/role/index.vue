<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.name" placeholder="名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:role:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-auth="'sys:role:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">菜单权限</el-button>
					<el-button v-auth="'sys:role:delete'" type="primary" link @click="deleteHandle(scope.row.id)">删除</el-button>
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
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="SysRoleIndex">
import {useCrud} from '@/hooks'
import {reactive, ref} from 'vue'
import AddOrUpdate from './add-or-update.vue'
import {IHooksOptions} from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/role/page',
	deleteUrl: '/sys/role',
	queryForm: {
		name: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}




const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteHandle } = useCrud(state)
</script>

<style scoped>

</style>
