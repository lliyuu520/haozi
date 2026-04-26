<template>
  <el-tooltip content="下载中心" effect="dark" placement="bottom">
    <div class="download-center">
      <svg-icon icon="icon-download" @click="sysDownloadCenterHandle" />
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import emits from '@/utils/emits'
import SvgIcon from "@/components/svg-icon/src/svg-icon.vue";

const sysDownloadCenterHandle = () => {
  emits.emit('openSysDownloadCenter')
}
</script>

<style lang="scss" scoped>
.download-center {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  margin: 0 8px;
  
  &:hover {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
}
</style>
