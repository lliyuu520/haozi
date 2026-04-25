<template>
	<el-card class="mod__menu">
		<el-form :inline="true">
			<el-form-item>
				<el-button v-auth="'sys:menu:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary"  @click="getDataList">刷新</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border row-key="id" style="width: 100%">
			<el-table-column header-align="center" label="名称" min-width="150" prop="name"></el-table-column>
			<el-table-column align="center" header-align="center" label="类型" prop="type">
				<template #default="scope">
					<el-tag v-if="scope.row.type === 0" type="info">菜单</el-tag>
					<el-tag v-if="scope.row.type === 1" type="success">按钮</el-tag>
					<el-tag v-if="scope.row.type === 2" type="warning">接口</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="排序" prop="weight"></el-table-column>
			<el-table-column :show-overflow-tooltip="true" align="center" header-align="center" label="路由" prop="url" width="150"></el-table-column>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				header-align="center"
				label="授权标识"
				prop="perms"
				width="150"
			></el-table-column>
			<el-table-column align="center" fixed="right" header-align="center" label="操作" width="150">
				<template #default="scope">
					<el-button v-auth="'sys:menu:save'" link type="primary" @click="addSubHandle(scope.row.id,scope.row.parentName)">新增子级</el-button>
					<el-button v-auth="'sys:menu:update'" link type="primary" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'sys:menu:delete'" link type="primary" @click="deleteHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
		<add-sub ref="addSubRef" @refresh-data-list="getDataList"></add-sub>
	</el-card>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import AddOrUpdate from "./add-or-update.vue";
import AddSub from "@/views/sys/menu/add-sub.vue";
import {IHooksOptions} from "@/hooks/interface";
import {useCrud} from "@/hooks";

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/menu/list',
	deleteUrl: '/sys/menu',
	isPage: false
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
const addSubRef = ref()

const addSubHandle = (id: number,parentName:string) => {
  addSubRef.value.init(id,parentName)
}

const { getDataList, deleteHandle } = useCrud(state)
</script>
