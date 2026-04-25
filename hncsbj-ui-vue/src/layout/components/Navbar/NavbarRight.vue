<template>
	<div class="navbar-right">
		<ComponentSize />
		<Fullscreen />
		<DownloadCenter/>
		<User />
		<ThemeSettings />
	</div>
  
  <!-- 下载中心 -->
  <SysDownloadCenter />
</template>

<script setup lang="ts">
import ComponentSize from './components/ComponentSize.vue'
import Fullscreen from './components/Fullscreen.vue'
import DownloadCenter from './components/DownloadCenter.vue'
import User from './components/User.vue'
import ThemeSettings from './components/ThemeSettings.vue'
import SysDownloadCenter from '@/views/sys/download-center/index.vue'
</script>

<style lang="scss" scoped>
.navbar-right {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	&-link {
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		&-photo {
			width: 25px;
			height: 25px;
			border-radius: 100%;
		}
	}
}
</style>
