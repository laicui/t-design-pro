<template>
  <div class="demo-container">
    <t-space direction="vertical" style="width: 100%" :size="40">
      <div class="demo-section">
        <h4>图片排序模式</h4>
        <p class="demo-desc">支持拖拽调整图片顺序，最多上传9张</p>
        <CosUpload
          v-model="sortableImages"
          theme="image-sortable"
          path="/demo/sortable/"
          :cos-options="cosOptions"
          accept="image/*"
          :max="9"
          :abridge-name="[8, 6]"
        />
      </div>

      <div class="demo-section">
        <h4>视频上传</h4>
        <p class="demo-desc">支持视频预览和封面选择，限制60秒以内</p>
        <CosUpload
          v-model="videoValue"
          v-model:loading="videoLoading"
          theme="video"
          path="/demo/videos/"
          :cos-options="cosOptions"
          accept="video/*"
          :video-maxduration="60"
          :max-file-size="{ size: 50, unit: 'MB' }"
          :poster="videoPoster"
          @update-poster="updateVideoPoster"
        />
        <div v-if="videoLoading" class="loading-tip"><t-loading size="small" /> 视频上传中...</div>
      </div>

      <div class="demo-section">
        <h4>文件列表模式</h4>
        <p class="demo-desc">详细的文件列表展示，支持多文件管理</p>
        <CosUpload
          v-model="filesList"
          theme="files-list"
          path="/demo/files-list/"
          :cos-options="cosOptions"
          :max="5"
          :max-file-size="{ size: 10, unit: 'MB' }"
          :oss-extend-options="{
            ContentDisposition: 'attachment'
          }"
        >
          <template #filesListButtonTitle> 选择文件（最多5个） </template>
        </CosUpload>
      </div>

      <div class="demo-section">
        <h4>音频上传（本地预览）</h4>
        <p class="demo-desc">音频文件本地预览，不上传到 COS</p>
        <CosUpload
          v-model="audioValue"
          theme="audio"
          path="/demo/audio/"
          :cos-options="cosOptions"
          accept="audio/*"
        />
      </div>

      <div class="demo-section">
        <h4>自定义上传按钮</h4>
        <p class="demo-desc">通过 custom 主题和默认插槽自定义</p>
        <CosUpload
          v-model="customValue"
          theme="custom"
          path="/demo/custom/"
          :cos-options="cosOptions"
          :disabled="customDisabled"
        >
          <t-button
            :theme="customValue.length ? 'default' : 'primary'"
            :variant="customValue.length ? 'outline' : 'base'"
            :loading="customDisabled"
          >
            <template #icon>
              <cloud-upload-icon v-if="!customValue.length" />
              <refresh-icon v-else />
            </template>
            {{ customValue.length ? '重新上传' : '选择文件上传' }}
          </t-button>
        </CosUpload>
        <div v-if="customValue.length" class="custom-result">
          已上传：{{ customValue[0]?.name || customValue[0]?.url }}
        </div>
      </div>

      <div class="demo-section">
        <h4>小尺寸图片上传</h4>
        <p class="demo-desc">使用 size="small" 显示小尺寸上传框</p>
        <CosUpload
          v-model="smallImages"
          theme="image"
          size="small"
          path="/demo/small/"
          :cos-options="cosOptions"
          accept="image/*"
          :max="4"
        />
      </div>

      <div class="demo-section">
        <h4>禁用状态</h4>
        <p class="demo-desc">设置 disabled 禁用上传功能</p>
        <CosUpload
          v-model="disabledValue"
          theme="image-sortable"
          path="/demo/disabled/"
          :cos-options="cosOptions"
          :disabled="true"
          :max="3"
        />
      </div>
    </t-space>
  </div>
</template>

<script setup lang="ts">
import { CosUpload } from 't-design-pro'
import { CloudUploadIcon, RefreshIcon } from 'tdesign-icons-vue-next'
import { Button as TButton, Loading as TLoading, Space as TSpace } from 'tdesign-vue-next'
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

// 不同主题的数据
const sortableImages = ref([])
const videoValue = ref([])
const videoPoster = ref([])
const videoLoading = ref(false)
const filesList = ref([])
const audioValue = ref([])
const customValue = ref([])
const customDisabled = ref(false)
const smallImages = ref([])
const disabledValue = ref([
  { url: 'https://tdesign.gtimg.com/demo/demo-image-1.png', name: 'demo1.png' },
  { url: 'https://tdesign.gtimg.com/demo/demo-image-2.png', name: 'demo2.png' }
])

// 视频封面更新
const updateVideoPoster = (poster) => {
  videoPoster.value = poster
  console.log('视频封面已更新：', poster)
}

// 监听自定义上传
watch(customValue, (val) => {
  if (val.length) {
    customDisabled.value = false
  }
})
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
  margin-bottom: 8px;
  color: var(--td-text-color-primary);
}

.demo-desc {
  margin-bottom: 16px;
  color: var(--td-text-color-secondary);
  font-size: 12px;
}

.loading-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: var(--td-text-color-brand);
  font-size: 14px;
}

.custom-result {
  margin-top: 12px;
  padding: 8px 12px;
  background: var(--td-success-color-1);
  border-radius: var(--td-radius-default);
  color: var(--td-success-color-7);
  font-size: 12px;
}
</style>
