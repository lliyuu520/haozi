<template>
	<el-dialog v-model="visible" title="修改密码" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item  prop="newPassword" label="密码">
				<el-input v-model="dataForm.newPassword" type="password" placeholder="密码" show-password></el-input>
			</el-form-item>
      <el-form-item  prop="repeatPassword" label="重复密码">
				<el-input v-model="dataForm.repeatPassword" type="password" placeholder="重复密码" show-password></el-input>
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
import {useUpdatePasswordApi, useUserApi, useUserSubmitApi} from '@/api/sys/user'
import {useRoleListApi} from '@/api/sys/role'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: NaN,
	newPassword: '',
  repeatPassword: ''
})

const resetForm = () => {
	Object.assign(dataForm, {
		id: NaN,
		newPassword: '',
    repeatPassword: ''
	})
}

const init = (id: number) => {
	visible.value = true
  resetForm()
	dataForm.id = id
  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

}

const dataRules = ref({
	newPassword: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  repeatPassword: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

    useUpdatePasswordApi(dataForm).then(() => {
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
