<template>
	<el-dialog v-model="visible" destroy-on-close title="日志详情" width="800px">
		<el-descriptions :column="2" border>
			<el-descriptions-item label="操作人">{{ dataForm.operatorName }}</el-descriptions-item>
			<el-descriptions-item label="操作类型">{{ dataForm.typeName }}</el-descriptions-item>
			<el-descriptions-item label="操作模块">{{ dataForm.moduleName }}</el-descriptions-item>
			<el-descriptions-item label="操作时间">{{ dataForm.operateTime }}</el-descriptions-item>
			<el-descriptions-item label="响应状态">
				<el-tag :type="dataForm.status === 0 ? 'success' : 'danger'">
					{{ dataForm.status === 0 ? '成功' : '失败' }}
				</el-tag>
			</el-descriptions-item>
			<el-descriptions-item></el-descriptions-item>
			<el-descriptions-item :span="2" label="请求参数">
				<div class="json-container">
					<el-button class="copy-btn" type="primary" link @click="copyContent(dataForm.requestParams)">复制</el-button>
					<pre class="json-content">{{ formatJson(dataForm.requestParams) }}</pre>
				</div>
			</el-descriptions-item>
			<el-descriptions-item :span="2" label="响应内容">
				<div class="json-container">
					<el-button class="copy-btn" type="primary" link @click="copyContent(dataForm.responseResult)">复制</el-button>
					<pre class="json-content">{{ formatJson(dataForm.responseResult) }}</pre>
				</div>
			</el-descriptions-item>
		</el-descriptions>
		<template #footer>
			<el-button @click="visible = false">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import {useLogApi} from "@/api/sys/log/api";
import {ElMessage} from "element-plus";
import {reactive, ref} from "vue";

const visible = ref(false)
const dataForm = reactive({
	id: '',
	operatorName: '',
	typeName: '',
	moduleName: '',
	operateTime: '',
	status: 0,
	requestParams: '',
	responseResult: ''
})

const formatJson = (content: string) => {
	try {
		if (!content) return '';
		const obj = JSON.parse(content);
		return JSON.stringify(obj, null, 2);
	} catch (e) {
		return content;
	}
}

// 修复后的copyContent方法，提供更好的兼容性
const copyContent = (content: string) => {
	if (!content) return;

	// 首先尝试使用现代 Clipboard API
	if (navigator.clipboard && window.isSecureContext) {
		navigator.clipboard.writeText(content).then(() => {
			ElMessage.success('复制成功');
		}).catch(() => {
			// 如果 Clipboard API 失败，则使用备用方法
			fallbackCopyTextToClipboard(content);
		});
	} else {
		// 如果不支持 Clipboard API，则使用备用方法
		fallbackCopyTextToClipboard(content);
	}
}

// 备用复制方法
const fallbackCopyTextToClipboard = (text: string) => {
	const textArea = document.createElement("textarea");
	textArea.value = text;

	// 避免滚动到底部
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.position = "fixed";
	textArea.style.opacity = "0";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		const successful = document.execCommand('copy');
		if (successful) {
			ElMessage.success('复制成功');
		} else {
			ElMessage.error('复制失败');
		}
	} catch (err) {
		ElMessage.error('复制失败');
	}

	document.body.removeChild(textArea);
}

const init = (id?: string) => {
	visible.value = true
	if (id) {
		useLogApi(id).then((res: any) => {
			Object.assign(dataForm, res.data)
		})
	}
}

defineExpose({
	init
})
</script>

<style scoped>
.json-container {
	position: relative;
	width: 100%;
}

.copy-btn {
	position: absolute;
	right: 0;
	top: 0;
	z-index: 1;
}

.json-content {
	margin: 0;
	padding: 10px;
	background-color: #f5f7fa;
	border-radius: 4px;
	max-height: 300px;
	overflow-y: auto;
	white-space: pre-wrap;
	word-wrap: break-word;
	font-family: Consolas, Monaco, 'Andale Mono', monospace;
	font-size: 13px;
	line-height: 1.5;
}
</style>
