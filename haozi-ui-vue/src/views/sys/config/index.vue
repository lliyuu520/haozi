<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item label="编码">
				<el-input v-model="state.queryForm.code" placeholder="参数编码" clearable></el-input>
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="state.queryForm.descs" placeholder="参数描述" clearable></el-input>
			</el-form-item>
			<el-form-item label="类型">
				<el-select v-model="state.queryForm.type" placeholder="参数类型" clearable style="width: 120px">
					<el-option
						v-for="item in configTypeOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:config:save'" type="success" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			border
			stripe
			style="width: 100%"
			@selection-change="selectionChangeHandle"
			@sort-change="sortChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50" />
			<el-table-column prop="code" label="编码" width="180" align="center" />
			<el-table-column prop="descs" label="描述" min-width="150" show-overflow-tooltip />
			<el-table-column label="类型" width="100" align="center">
				<template #default="scope">
					<el-tag :type="getConfigTypeTagType(scope.row.type)">
						{{ formatConfigType(scope.row.type) }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column v-if="hasType('SWITCH_TYPE')" label="开关状态" width="100" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.type === 'SWITCH_TYPE'" :type="scope.row.enabled ? 'success' : 'danger'">
						{{ scope.row.enabled ? '已启用' : '已禁用' }}
					</el-tag>
					<span v-else>-</span>
				</template>
			</el-table-column>
			<el-table-column v-if="hasType('NUMBER_TYPE')" label="数值" width="100" align="center">
				<template #default="scope">
					<span v-if="scope.row.type === 'NUMBER_TYPE'">
						{{ scope.row.num }}
					</span>
					<span v-else>-</span>
				</template>
			</el-table-column>
			<el-table-column v-if="hasType('TEXT_TYPE')" label="文本" min-width="150" align="center" show-overflow-tooltip>
				<template #default="scope">
					<span v-if="scope.row.type === 'TEXT_TYPE'">
						{{ scope.row.text }}
					</span>
					<span v-else>-</span>
				</template>
			</el-table-column>
			<el-table-column v-if="hasType('FILE_TYPE')" label="文件" min-width="150" align="center">
				<template #default="scope">
					<div v-if="scope.row.type === 'FILE_TYPE' && scope.row.files && scope.row.files.length > 0">
						<el-link
							v-for="(file, index) in scope.row.files"
							:key="index"
							:href="file.url"
							target="_blank"
							type="primary"
							underline
						>
							{{ file.name || '文件' + (index + 1) }}
						</el-link>
					</div>
					<span v-else>-</span>
				</template>
			</el-table-column>
			<el-table-column v-if="hasType('IMAGE_TYPE')" label="图片" min-width="150" align="center">
				<template #default="scope">
					<div v-if="scope.row.type === 'IMAGE_TYPE' && scope.row.images && scope.row.images.length > 0">
						<el-image
							v-for="(img, index) in scope.row.images"
							:key="index"
							:src="img.url"
							:initial-index="index"
							:preview-src-list="scope.row.images.map((item: any) => item.url)"
							preview-teleported
							style="width: 50px; height: 50px; margin-right: 5px; margin-bottom: 5px; border-radius: 4px"
						>
							<template #error>
								<div class="image-error">
									<el-icon><Picture /></el-icon>
									<div>图片加载失败</div>
								</div>
							</template>
						</el-image>
					</div>
					<span v-else>-</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="180" align="center">
				<template #default="scope">
					<el-button v-auth="'sys:config:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">
						修改
					</el-button>
					<el-button v-auth="'sys:config:delete'" type="danger" link @click="deleteConfirm(scope.row)">
						删除
					</el-button>
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
		/>
	</el-card>
	<!-- 新增 / 修改 -->
	<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
</template>

<script setup lang="ts" name="SysConfigIndex">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddOrUpdate from './add-or-update.vue'
import { useCrud } from '@/hooks'
import { useSysConfigApi, useSysConfigSubmitApi, useSysConfigDeleteApi, useSysConfigDeleteBatchApi, useSysConfigByCodeApi } from '@/api/sys/config'
import { Picture } from '@element-plus/icons-vue'

const state = reactive({
	dataListUrl: '/sys/config/page',
	deleteUrl: '/sys/config',
	queryForm: {
		code: '',
		descs: '',
		type: '',
		enabled: null
	},
	dataList: [] as any[],
	dataListLoading: false,
	page: 1,
	limit: 10,
	total: 0,
	pageSizes: [1, 10, 20, 50, 100, 200]
})

const { getDataList, selectionChangeHandle, sortChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)

// 参数类型选项
const configTypeOptions = [
	{ label: '开关', value: 'SWITCH_TYPE' },
	{ label: '文本', value: 'TEXT_TYPE' },
	{ label: '数字', value: 'NUMBER_TYPE' },
	{ label: '文件', value: 'FILE_TYPE' },
	{ label: '图片', value: 'IMAGE_TYPE' }
]

// 开关状态选项
const enabledOptions = [
	{ label: '已启用', value: true },
	{ label: '已禁用', value: false }
]

// 检查数据中是否包含指定类型的参数
const hasType = (type: string) => {
	return state.dataList.some(item => item.type === type)
}

// 格式化参数类型
const formatConfigType = (type: string) => {
	const option = configTypeOptions.find(item => item.value === type)
	return option ? option.label : type
}

// 获取参数类型标签类型
const getConfigTypeTagType = (type: string) => {
	switch (type) {
		case 'SWITCH_TYPE':
			return 'primary'
		case 'TEXT_TYPE':
			return 'warning'
		case 'NUMBER_TYPE':
			return 'success'
		case 'FILE_TYPE':
			return 'info'
		case 'IMAGE_TYPE':
			return 'danger'
		default:
			return 'info'
	}
}

// 删除确认
const deleteConfirm = (row: any) => {
	ElMessageBox.confirm(
		`确认删除该系统参数吗？`,
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}
	).then(() => {
		deleteHandle(row.id)
	}).catch(() => {
		ElMessage.info('已取消删除')
	})
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

// 重写删除方法，增加确认
const deleteHandle = (id: number) => {
	useSysConfigDeleteApi(id).then(() => {
		ElMessage.success('删除成功')
		getDataList()
	}).catch(error => {
		console.error('删除失败:', error)
		ElMessage.error('删除失败，请重试')
	})
}
</script>

<style scoped lang="scss">
.el-table {
	margin-top: 16px;
}

.el-pagination {
	margin-top: 20px;
	justify-content: center;
}

.image-error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	color: #909399;
}

.image-error .el-icon {
	font-size: 24px;
	margin-bottom: 8px;
}
</style>
