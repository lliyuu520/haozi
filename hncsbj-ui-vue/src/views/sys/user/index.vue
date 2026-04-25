<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.username" placeholder="账号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:user:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column prop="username" label="账号" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center">
				<template #default="scope">
					<el-button v-auth="'sys:user:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'sys:user:update'" type="primary" link @click="updatePasswordHandle(scope.row.id)">修改密码</el-button>
					<el-button v-auth="'sys:user:delete'" type="primary" link @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <update-password ref="updatePasswordRef" @refresh-data-list="getDataList"></update-password>
	</el-card>
</template>

<script setup lang="ts" name="SysUserIndex">
import {useCrud} from '@/hooks'
import {reactive, ref} from 'vue'
import AddOrUpdate from './add-or-update.vue'
import {IHooksOptions} from '@/hooks/interface'
import UpdatePassword from "@/views/sys/user/update-password.vue";

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/user/page',
	deleteUrl: '/sys/user',
	queryForm: {
		username: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
const updatePasswordRef = ref()
const updatePasswordHandle = (id: number) => {
	updatePasswordRef.value.init(id)
}






const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteHandle } = useCrud(state)
</script>
