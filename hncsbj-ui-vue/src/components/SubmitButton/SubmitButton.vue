<template>
  <el-button
    :loading="submitting"
    :disabled="disabled || submitting"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  disabled?: boolean
}

interface Emits {
  (e: 'click', event: Event): void
  (e: 'submit'): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<Emits>()

const submitting = ref(false)

const handleClick = async (event: Event) => {
  // 如果正在提交中，直接返回
  if (submitting.value) {
    return
  }
  
  // 发送点击事件
  emit('click', event)
  
  // 如果有submit事件监听器，说明需要防重复处理
  if (typeof emit === 'function' && (event.target as HTMLElement).hasAttribute('data-submit-guard')) {
    submitting.value = true
    
    try {
      // 设置超时保护
      const timeoutId = setTimeout(() => {
        submitting.value = false
      }, 5000)
      
      // 触发提交事件
      await emit('submit')
      
      clearTimeout(timeoutId)
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      submitting.value = false
    }
  }
}

// 暴露方法供外部调用
defineExpose({
  submitting,
  reset: () => {
    submitting.value = false
  }
})
</script>