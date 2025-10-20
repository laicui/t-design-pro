<template>
  <div class="demo-container">
    <div class="demo-item">
      <p class="demo-label">异步开关（点击后延迟1秒）：</p>
      <SwitchPro v-model="asyncValue" :request="handleRequest" />
      <span class="demo-value">当前值：{{ asyncValue }}</span>
    </div>

    <div class="demo-item">
      <p class="demo-label">随机成功的异步开关（50%概率失败）：</p>
      <SwitchPro v-model="randomValue" :request="handleRandomRequest" />
      <span class="demo-value">当前值：{{ randomValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SwitchPro } from 't-design-pro'
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'

const asyncValue = ref<boolean>(false)
const randomValue = ref<boolean>(false)

// 模拟异步请求
const handleRequest = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      MessagePlugin.success('操作成功')
      resolve(true)
    }, 1000)
  })
}

// 模拟随机成功的请求
const handleRandomRequest = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.5
      if (success) {
        MessagePlugin.success('操作成功')
        resolve(true)
      } else {
        MessagePlugin.error('操作失败，请稍后重试')
        resolve(false)
      }
    }, 1000)
  })
}
</script>

<style scoped>
.demo-container {
  padding: 16px;
}

.demo-item {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.demo-label {
  margin: 0 16px 0 0;
  min-width: 200px;
  color: var(--td-text-color-secondary);
}

.demo-value {
  margin-left: 16px;
  color: var(--td-text-color-primary);
}
</style>