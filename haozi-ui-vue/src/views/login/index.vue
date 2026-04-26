<template>
	<div class="login-container">
		<div class="login-intro">
			<h1>Haozi 管理系统</h1>
			<div class="desc">
			Haozi 管理系统
			</div>
			<div class="login-bg"><img src="@/assets/login.png" /></div>
		</div>
		<div class="login-form">
			<account></account>
		</div>
	</div>
</template>

<script setup lang="ts">
import Account from './account.vue'
</script>

<style lang="scss" scoped>
.login-container {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	height: 100vh;
}
.login-intro {
	display: flex;
	flex-direction: column;
	width: 520px;
	flex: 0 1 auto;
}
.login-intro h1 {
	color: var(--el-color-primary);
}
.login-intro .desc {
	color: rgb(113, 115, 112);
	line-height: 32px;
	padding: 15px 0;
}
.login-bg img {
	width: 520px;
}
.login-form {
	background-color: #fff;
	flex: 0 1 auto;
	padding: 40px;
	border-radius: 6px;
	box-shadow: 1px 1px 8px #aaa6a6;
	box-sizing: border-box;
	width: 440px;

	:deep(.el-input) {
		height: 45px;
		margin-top: 5px;
		.el-input__inner {
			padding: 10px 15px 10px 5px;
			height: 45px;
			line-height: 45px;
			color: #666;
			font-size: 16px;
		}
	}
}

.login-more {
	display: flex;
	justify-content: space-evenly;
	padding-top: 25px;
	width: 200px;
	margin: 0 auto;
}
@media only screen and (max-width: 992px) {
	.login-intro {
		display: none;
	}
}
@media only screen and (max-width: 768px) {
	.login-container {
		background: #fff;
	}
	.login-intro {
		display: none;
	}
	.login-form {
		flex: 0 1 auto;
		border-radius: 0;
		box-shadow: none;
	}
	.login-captcha {
		:deep(.el-input) {
			width: 150px;
		}
	}
}
</style>
