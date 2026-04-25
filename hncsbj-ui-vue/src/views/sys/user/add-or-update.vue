<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="username" label="账号">
				<el-input v-model="dataForm.username" placeholder="账号"></el-input>
			</el-form-item>
			<el-form-item v-if="!dataForm.id" prop="password" label="密码">
				<el-input v-model="dataForm.password" type="password" placeholder="密码" show-password></el-input>
			</el-form-item>
			<el-form-item prop="roleIdList" label="角色">
				<el-select v-model="dataForm.roleIdList" multiple placeholder="角色" style="width: 100%">
					<el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {ElMessage} from 'element-plus/es'
import {useUserApi, useUserSubmitApi} from '@/api/sys/user'
import {useRoleListApi} from '@/api/sys/role'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const roleList = ref<any[]>([])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	username: '',
	password: '',
	roleIdList: [] as any[]
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	// id 存在则为修改
	if (id) {
		getUser(id)
	}
	getRoleList()
}

// 获取部门列表
const getRoleList = () => {
	return useRoleListApi().then(res => {
		roleList.value = res.data
	})
}

// 获取信息
const getUser = (id: number) => {
	useUserApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useUserSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
