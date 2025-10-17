<template>
  <div class="demo-container">
    <t-space style="width: 100%" direction="vertical" :size="40">
      <div class="demo-section">
        <h4>文件上传（默认主题）</h4>
        <CosUpload v-model="fileValue" path="/demo/files/" :cos-options="cosOptions" />
        <div class="demo-result">
          <p>已上传文件：</p>
          <pre>{{ JSON.stringify(fileValue, null, 2) }}</pre>
        </div>
      </div>

      <div class="demo-section">
        <h4>图片上传</h4>
        <CosUpload
          v-model="imageValue"
          theme="image"
          path="/demo/images/"
          :cos-options="cosOptions"
          accept="image/*"
          :max="3"
        />
      </div>

      <div class="demo-section">
        <h4>输入框模式</h4>
        <CosUpload
          v-model="inputValue"
          theme="file-input"
          path="/demo/input/"
          :cos-options="cosOptions"
        />
      </div>
    </t-space>
  </div>
</template>

<script setup lang="ts">
import { CosUpload } from 't-design-pro'
import { Space as TSpace } from 'tdesign-vue-next'
import { useData } from 'vitepress'
import { ref, watch } from 'vue'

import getAuthorization from './getAuthorization'

const { isDark } = useData()

watch(
  isDark,
  (newVal) => {
    document.documentElement.setAttribute('theme-mode', newVal ? 'dark' : 'light')
  },
  {
    immediate: true
  }
)

const Bucket = import.meta.env.VITE_COS_BUCKET || 'demo-bucket'
const Region = import.meta.env.VITE_COS_REGION || 'ap-shanghai'

const cosOptions = {
  Bucket,
  Region,
  getAuthorization
}

const fileValue = ref([])
const imageValue = ref([])
const inputValue = ref([])
</script>

<style scoped>
.demo-container {
  padding: 16px;
}

.demo-section {
  padding: 20px;
  background: var(--td-bg-color-container);
  border-radius: var(--td-radius-medium);
}

.demo-section h4 {
  margin-bottom: 16px;
  color: var(--td-text-color-primary);
}

.demo-result {
  margin-top: 16px;
  padding: 12px;
  background: var(--td-bg-color-component);
  border-radius: var(--td-radius-default);
}

.demo-result p {
  margin-bottom: 8px;
  color: var(--td-text-color-secondary);
  font-size: 12px;
}

.demo-result pre {
  font-size: 12px;
  color: var(--td-text-color-primary);
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
