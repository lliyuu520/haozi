<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增系统参数' : '修改系统参数'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="编码" prop="code">
				<el-input v-model="dataForm.code" placeholder="请输入参数编码" :disabled="dataForm.id !== ''" />
			</el-form-item>
			<el-form-item label="描述" prop="descs">
				<el-input v-model="dataForm.descs" placeholder="请输入参数描述" />
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-select v-model="dataForm.type" placeholder="请选择参数类型" :disabled="dataForm.id !== ''" style="width: 100%">
					<el-option
						v-for="item in configTypeOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item v-if="dataForm.type === 'SWITCH_TYPE'" label="开关状态" prop="enabled">
				<el-switch v-model="dataForm.enabled" :active-text="dataForm.enabled ? '启用' : '禁用'" />
			</el-form-item>
			<el-form-item v-if="dataForm.type === 'NUMBER_TYPE'" label="数值" prop="num">
				<el-input-number v-model.number="dataForm.num" placeholder="请输入数值" :min="0" />
			</el-form-item>
			<el-form-item v-if="dataForm.type === 'TEXT_TYPE'" label="文本" prop="text">
				<el-input v-model="dataForm.text" placeholder="请输入文本内容" type="textarea" :rows="3" />
			</el-form-item>
			<el-form-item v-if="dataForm.type === 'FILE_TYPE'" label="文件" prop="files">
				<el-upload
					v-model:file-list="dataForm.files"
					class="upload-demo"
					:on-remove="handleRemove"
					multiple
					:limit="5"
					:http-request="uploadOss"
					:before-upload="handleBeforeUpload"
					:on-success="handleUploadSuccess"
					list-type="text"
				>
					<el-button type="primary">
						<el-icon><Plus /></el-icon>
						选择文件
					</el-button>
					<template #tip>
						<div class="el-upload__tip text-red">
							支持多种文件格式，文件大小不超过10MB<br/>
							最多上传5个文件
						</div>
					</template>
				</el-upload>
			</el-form-item>
			<el-form-item v-if="dataForm.type === 'IMAGE_TYPE'" label="图片" prop="images">
				<el-upload
					v-model:file-list="dataForm.images"
					class="upload-demo"
					:on-remove="handleRemove"
					multiple
					:limit="5"
					:http-request="uploadOss"
					:before-upload="handleBeforeUpload"
					:on-success="handleUploadSuccess"
					:on-preview="handleImageUrlPreview"
					list-type="picture-card"
				>
					<el-icon><Plus /></el-icon>
					<template #tip>
						<div class="el-upload__tip text-red">
							仅支持jpg/png文件，且不超过5MB<br/>
							最多5张图片
						</div>
					</template>
				</el-upload>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="dataForm.remark" placeholder="请输入备注信息" type="textarea" :rows="3" show-word-limit maxlength="200" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="submitHandle">确定</el-button>
			</div>
		</template>
	</el-dialog>

	<!-- 图片预览弹窗 -->
	<el-dialog
		v-model="imageUrlDialogVisible"
		title="图片预览"
		width="80%"
		:append-to-body="true"
	>
		<div class="image-preview-container">
			<img :src="dialogImageUrl" alt="预览图片" class="preview-image" />
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useSysConfigApi, useSysConfigSubmitApi } from '@/api/sys/config'
import { Plus } from '@element-plus/icons-vue'
import {
	uploadOss,
	handleBeforeUpload,
	dialogImageUrl,
	imageUrlDialogVisible,
	handleUploadSuccess,
	handleImageUrlPreview,
	handleRemove
} from '@/utils/tool'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	code: '',
	descs: '',
	type: '',
	enabled: true,
	num: 0,
	text: '',
	files: [],
	images: [],
	remark: ''
})

const reset = () => {
	Object.assign(dataForm, {
		id: '',
		code: '',
		descs: '',
		type: '',
		enabled: true,
		num: 0,
		text: '',
		files: [],
		images: [],
		remark: ''
	})
}

const init = (id?: number) => {
	visible.value = true
	reset()
	
	if (id && id > 0) {
		getSysConfig(id)
	}
}

const getSysConfig = (id: number) => {
	useSysConfigApi(id).then(res => {
		Object.assign(dataForm, res.data)
		// 确保文件和图片列表格式正确
		if (res.data.files && Array.isArray(res.data.files)) {
			dataForm.files = res.data.files.map((file: any) => ({
				url: file.url,
				name: file.name || '文件'
			}))
		} else {
			dataForm.files = []
		}
		if (res.data.images && Array.isArray(res.data.images)) {
			dataForm.images = res.data.images.map((img: any) => ({
				url: img.url,
				name: img.name || '图片'
			}))
		} else {
			dataForm.images = []
		}
	})
}

const handleCancel = () => {
	visible.value = false
}

const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		// 系统预定义参数不能修改类型
		if (dataForm.id && isSystemCode(dataForm.code)) {
			// 保留原始类型
			const originalData = { ...dataForm }
			useSysConfigSubmitApi(originalData).then(() => {
				ElMessage.success({
					message: '操作成功',
					duration: 500,
					onClose: () => {
						visible.value = false
						emit('refreshDataList')
					}
				})
			}).catch(error => {
				console.error('提交失败:', error)
				ElMessage.error('操作失败，请重试')
			})
		} else {
			useSysConfigSubmitApi(dataForm).then(() => {
				ElMessage.success({
					message: '操作成功',
					duration: 500,
					onClose: () => {
						visible.value = false
						emit('refreshDataList')
					}
				})
			}).catch(error => {
				console.error('提交失败:', error)
				ElMessage.error('操作失败，请重试')
			})
		}
	})
}

// 系统预定义编码
const systemCodes = [
	'SYSTEM_NAME',
	'SYSTEM_DESCRIPTION',
	'SYSTEM_MAINTENANCE_ENABLED'
]

// 判断是否为系统预定义编码
const isSystemCode = (code: string) => {
	return systemCodes.includes(code)
}

// 参数类型选项
const configTypeOptions = [
	{ label: '开关', value: 'SWITCH_TYPE' },
	{ label: '文本', value: 'TEXT_TYPE' },
	{ label: '数字', value: 'NUMBER_TYPE' },
	{ label: '文件', value: 'FILE_TYPE' },
	{ label: '图片', value: 'IMAGE_TYPE' }
]

// 表单验证规则
const dataRules = reactive({
	code: [
		{ required: true, message: '参数编码不能为空', trigger: 'blur' },
		{ pattern: /^[A-Z_]+$/, message: '参数编码只能包含大写字母和下划线', trigger: 'blur' }
	],
	descs: [
		{ required: true, message: '参数描述不能为空', trigger: 'blur' }
	],
	type: [
		{ required: true, message: '参数类型不能为空', trigger: 'change' }
	],
	num: [
		{ required: true, message: '数值不能为空', trigger: 'blur' }
	]
})

defineExpose({
	init
})
</script>

<style scoped lang="scss">
.dialog-footer {
	text-align: right;
	padding-top: 16px;
	border-top: 1px solid #f0f0f0;
}

.image-preview-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20px;
}

.preview-image {
	max-width: 100%;
	max-height: 80vh;
	object-fit: contain;
}

.text-red {
	color: #f56c6c;
}

.upload-demo {
	width: 100%;
}
</style>
