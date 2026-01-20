<template>
  <div class="demo-container">
    <div class="demo-item">
      <p class="demo-label">数字值开关 (1/0)：</p>
      <SwitchPro v-model="numberValue" :custom-value="[1, 0]" />
      <span class="demo-value"
        >当前值：{{ numberValue }} (类型: {{ typeof numberValue }})</span
      >
    </div>

    <div class="demo-item">
      <p class="demo-label">字符串值开关 ('on'/'off')：</p>
      <SwitchPro v-model="stringValue" :custom-value="['on', 'off']" />
      <span class="demo-value"
        >当前值：{{ stringValue }} (类型: {{ typeof stringValue }})</span
      >
    </div>

    <div class="demo-item">
      <p class="demo-label">自定义值配合异步请求：</p>
      <SwitchPro
        v-model="customAsyncValue"
        :custom-value="['active', 'inactive']"
        :request="handleCustomRequest"
      />
      <span class="demo-value">当前值：{{ customAsyncValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SwitchPro } from 't-design-pro'
import { MessagePlugin, SwitchValue } from 'tdesign-vue-next'
import { ref } from 'vue'

// 数字类型的值
const numberValue = ref<SwitchValue>(0)

// 字符串类型的值
const stringValue = ref<SwitchValue>('off')

// 自定义值配合异步请求
const customAsyncValue = ref<SwitchValue>('inactive')

const handleCustomRequest = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      MessagePlugin.success(
        `状态将切换为: ${customAsyncValue.value === 'active' ? 'inactive' : 'active'}`
      )
      resolve(true)
    }, 800)
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
  font-family: var(--td-font-family-mono);
}
</style>
