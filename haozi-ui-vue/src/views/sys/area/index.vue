<template>
	<el-card>
		<el-form :inline="true">
			<el-form-item>
				<el-button type="primary" @click="refreshDataList">刷新缓存</el-button>
			</el-form-item>
		</el-form>
		<div class="custom-tree-container">
			<el-tree-v2
				:data="areaTree"
				:props="treeProps"
				:height="800"
				:expand-on-click-node="false"
				ref="treeRef"
			>
				<template #default="{ node, data }">
					<span class="custom-tree-node">
						<span>{{ node.label }} ({{ data.value }})</span>
						<span>
							<el-button type="primary" link @click="append(data)">新增子级</el-button>
							<el-button type="warning" link @click="edit(data)">编辑</el-button>
							<el-button type="danger" link @click="remove(node, data)">删除</el-button>
						</span>
					</span>
				</template>
			</el-tree-v2>
		</div>
	</el-card>

	<el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="resetForm">
		<el-form :model="dataForm" :rules="dataRules" ref="formRef" label-width="80px">
			<el-form-item label="父级节点" prop="parentCode">
				<el-input v-model="dataForm.parentCode" disabled />
			</el-form-item>
			<el-form-item label="区域编码" prop="code">
				<el-input v-model="dataForm.code" placeholder="请输入区域编码"  readonly/>
			</el-form-item>
			<el-form-item label="区域名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="请输入区域名称" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="dialogVisible = false">取消</el-button>
			<el-button type="primary" @click="submitForm">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="SysAreaIndex">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { useSysAreaAllNodeApi, useSysAreaSaveApi, useSysAreaUpdateApi, useSysAreaDeleteApi, useSysAreaRefreshCacheApi} from '@/api/sys/area'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'

const areaTree = ref<any[]>([])
const treeRef = ref()
const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogTitle = ref('')

const treeProps = {
	value: 'value',
	label: 'label',
	children: 'children'
}

const dataForm = reactive({
	code: '',
	name: '',
	parentCode: '0'
})

const dataRules = reactive<FormRules>({
	code: [{ required: true, message: '区域编码不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '区域名称不能为空', trigger: 'blur' }]
})

const getDataList = async () => {
	try {
		const res = await useSysAreaAllNodeApi()
		areaTree.value = res.data || []
	} catch (err) {
		ElMessage.error('获取行政区域数据失败')
		console.error(err)
	}
}

const refreshDataList = async () => {
	try {
		await useSysAreaRefreshCacheApi()
		ElMessage.success('刷新成功')
		await getDataList()
	} catch (err) {
		ElMessage.error('刷新缓存失败')
		console.error(err)
	}
}

const append = (data: any) => {
	dialogTitle.value = '新增子级节点'
	resetForm()
	dataForm.parentCode = data.value
	dialogVisible.value = true
}

const edit = (data: any) => {
	dialogTitle.value = '编辑节点'
	resetForm()
	nextTick(() => {
		dataForm.code = data.value
		dataForm.name = data.label
		// Note: parentCode is not available directly from node data, might need enhancement if required.
	})
	dialogVisible.value = true
}

const remove = (node: any, data: any) => {
	ElMessageBox.confirm(`确定要删除 [${data.label}] 吗?`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(async () => {
		try {
			await useSysAreaDeleteApi(data.value)
			ElMessage.success('删除成功')
			await getDataList()
		} catch (err) {
			console.error(err)
		}
	})
}

const resetForm = () => {
	dataForm.code = ''
	dataForm.name = ''
	dataForm.parentCode = '0'
	formRef.value?.resetFields()
}

const submitForm = async () => {
	await formRef.value?.validate(async (valid) => {
		if (valid) {
			try {
				if (dialogTitle.value === '编辑节点') {
					await useSysAreaUpdateApi(dataForm)
					ElMessage.success('更新成功')
				} else {
					await useSysAreaSaveApi(dataForm)
					ElMessage.success('新增成功')
				}
				dialogVisible.value = false
				await getDataList()
			} catch (err) {
				console.error(err)
			}
		}
	})
}

onMounted(() => {
	getDataList()
})
</script>

<style scoped>
.custom-tree-container {
	padding: 20px;
}
.custom-tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 8px;
}
</style>
