<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @keyup.enter="onLogin">
		<div class="login-title">登录</div>
		<el-form-item prop="username" label="账号">
			<el-input v-model="loginForm.username" :prefix-icon="User"></el-input>
		</el-form-item>
		<el-form-item prop="password" label="密码">
			<el-input v-model="loginForm.password" :prefix-icon="Lock" show-password ></el-input>
		</el-form-item>
		<el-form-item class="login-button">
			<el-button type="primary" @click="onLogin()">登录</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {Lock, User} from '@element-plus/icons-vue'
import store from '@/store'
import {useRouter} from 'vue-router'

const router = useRouter()
const loginFormRef = ref()

const loginForm = reactive({
	username: '',
	password: ''
})

const loginRules = ref({
	username: [{ required: true, message: '必填项', trigger: 'blur' }],
	password: [{ required: true, message: '必填项', trigger: 'blur' }]
})

const onLogin = () => {
	loginFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		// 用户登录
		store.userStore
			.accountLoginAction(loginForm)
			.then(() => {
				router.push({ path: '/home' })
			})
			.catch(() => {
				// onCaptcha()
			})
	})
}
</script>

<style lang="scss" scoped>
.login-title {
	display: flex;
	justify-content: center;
	margin-bottom: 35px;
	font-size: 24px;
	color: #444;
	letter-spacing: 4px;
}
.login-captcha {
	:deep(.el-input) {
		width: 200px;
	}
}
.login-captcha img {
	width: 150px;
	height: 40px;
	margin: 5px 0 0 10px;
	cursor: pointer;
}
.login-button {
	:deep(.el-button--primary) {
		margin-top: 10px;
		width: 100%;
		height: 45px;
		font-size: 18px;
		letter-spacing: 8px;
	}
}
</style>
