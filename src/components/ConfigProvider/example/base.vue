<template>
  <div class="app-demo">
    <h3>应用级国际化配置</h3>
    <p class="description">这是一个模拟整个应用使用 ConfigProvider 的示例</p>

    <ConfigProviderPro :locale="appLocale">
      <layout @lang-change="changeLocale" :key="appLocale"></layout>
    </ConfigProviderPro>
  </div>
</template>

<script setup lang="ts">
import { ConfigProviderPro } from 't-design-pro'
import { ref } from 'vue'

import layout from './layout.vue'
const appLocale = ref('zh-CN')
function changeLocale(newLocale: string) {
  appLocale.value = newLocale
}
</script>

<style scoped>
.app-demo {
  padding: 20px;
}

.description {
  color: var(--td-text-color-secondary);
  margin-bottom: 20px;
}

.app-layout {
  border: 1px solid var(--td-border-level-1-color);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--td-bg-color-container);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: var(--td-brand-color);
  color: white;
}

.navbar .title {
  font-size: 18px;
  font-weight: bold;
}

.content {
  padding: 24px;
}

.form-section {
  max-width: 600px;
}
</style>
