<template>
  <div class="demo-container">
    <t-space direction="vertical" style="width: 100%" :size="40">
      <div class="demo-section">
        <h4>使用工具函数上传</h4>
        <p class="demo-desc">通过 uploadFileToCos 函数实现自定义上传逻辑</p>

        <div class="custom-upload">
          <input
            ref="inputRef"
            type="file"
            accept="image/*"
            class="file-input"
            @change="handleFileUpload"
          />
          <t-button :loading="inputLoading" @click="triggerFileSelect">
            <template #icon><upload-icon /></template>
            {{ imageSrc ? '重新选择图片' : '选择图片上传' }}
          </t-button>
        </div>

        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress-bar">
          <t-progress :percentage="uploadProgress" />
          <span class="progress-text">上传中 {{ uploadProgress }}%</span>
        </div>

        <div v-if="imageSrc" class="upload-result">
          <div class="image-preview">
            <img :src="imageSrc" alt="上传的图片" />
          </div>
          <div class="image-info">
            <p><strong>文件URL：</strong></p>
            <t-input v-model="imageSrc" readonly :tips="imageSrc" />
            <t-button size="small" variant="text" @click="copyUrl"> 复制链接 </t-button>
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          <t-alert theme="error" :message="errorMessage" />
        </div>
      </div>

      <div class="demo-section">
        <h4>批量上传（使用工具函数）</h4>
        <p class="demo-desc">支持选择多个文件同时上传</p>

        <div class="custom-upload">
          <input
            ref="multiInputRef"
            type="file"
            accept="image/*"
            multiple
            class="file-input"
            @change="handleMultiFileUpload"
          />
          <t-button
            :loading="multiLoading"
            :disabled="multiLoading"
            @click="triggerMultiFileSelect"
          >
            <template #icon><folder-add-icon /></template>
            选择多个文件
          </t-button>
          <span v-if="multiFiles.length > 0" class="file-count">
            已上传 {{ multiFiles.length }} 个文件
          </span>
        </div>

        <div v-if="multiLoading" class="uploading-list">
          <h5>上传队列：</h5>
          <div v-for="(file, index) in uploadingFiles" :key="index" class="uploading-item">
            <span class="file-name">{{ file.name }}</span>
            <t-progress :percentage="file.progress || 0" size="small" style="flex: 1" />
          </div>
        </div>

        <div v-if="multiFiles.length > 0" class="files-grid">
          <div v-for="(file, index) in multiFiles" :key="index" class="file-card">
            <img :src="file.url" alt="" />
            <t-button
              size="small"
              shape="circle"
              variant="outline"
              class="remove-btn"
              @click="removeFile(index)"
            >
              <template #icon><close-icon /></template>
            </t-button>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h4>带图片处理的上传</h4>
        <p class="demo-desc">上传后自动应用图片处理规则（缩略图、水印等）</p>

        <t-radio-group v-model="processType" variant="default-filled">
          <t-radio-button value="thumbnail">生成缩略图</t-radio-button>
          <t-radio-button value="watermark">添加水印</t-radio-button>
          <t-radio-button value="compress">压缩图片</t-radio-button>
        </t-radio-group>

        <div class="custom-upload" style="margin-top: 16px">
          <input
            ref="processInputRef"
            type="file"
            accept="image/*"
            class="file-input"
            @change="handleProcessFileUpload"
          />
          <t-button :loading="processLoading" @click="triggerProcessFileSelect">
            <template #icon><image-icon /></template>
            选择图片（带处理）
          </t-button>
        </div>

        <div v-if="processedImage" class="compare-images">
          <div class="image-box">
            <h5>原图</h5>
            <img :src="originalImage" alt="原图" />
          </div>
          <div class="image-box">
            <h5>处理后</h5>
            <img :src="processedImage" alt="处理后" />
          </div>
        </div>
      </div>
    </t-space>
  </div>
</template>

<script setup lang="ts">
import { uploadFileToCos } from 't-design-pro'
import { CloseIcon, FolderAddIcon, ImageIcon, UploadIcon } from 'tdesign-icons-vue-next'
import {
  Alert as TAlert,
  Button as TButton,
  Input as TInput,
  MessagePlugin,
  Progress as TProgress,
  RadioButton as TRadioButton,
  RadioGroup as TRadioGroup,
  Space as TSpace
} from 'tdesign-vue-next'
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

// 单文件上传
const inputRef = ref<HTMLInputElement | null>(null)
const inputLoading = ref(false)
const imageSrc = ref('')
const uploadProgress = ref(0)
const errorMessage = ref('')

// 多文件上传
const multiInputRef = ref<HTMLInputElement | null>(null)
const multiLoading = ref(false)
const multiFiles = ref<Array<{ url: string; name: string }>>([])
const uploadingFiles = ref<Array<{ name: string; progress: number }>>([])

// 图片处理
const processInputRef = ref<HTMLInputElement | null>(null)
const processLoading = ref(false)
const processType = ref('thumbnail')
const originalImage = ref('')
const processedImage = ref('')

// 触发文件选择
const triggerFileSelect = () => {
  inputRef.value?.click()
}

const triggerMultiFileSelect = () => {
  multiInputRef.value?.click()
}

const triggerProcessFileSelect = () => {
  processInputRef.value?.click()
}

// 单文件上传处理
async function handleFileUpload() {
  const file = inputRef.value?.files?.[0]
  if (!file) return

  inputLoading.value = true
  uploadProgress.value = 0
  errorMessage.value = ''

  const cosOptions = {
    Bucket,
    Region,
    path: '/demo/utils/',
    getAuthorization: getAuthorization,
    onProgress: (res) => {
      uploadProgress.value = Math.round(res.percent * 100)
    }
  }

  try {
    const result = await uploadFileToCos(cosOptions, file)

    if (result.data) {
      imageSrc.value = result.data.url
      MessagePlugin.success('上传成功！')
    } else {
      throw new Error(result.err?.message || '上传失败')
    }
  } catch (error: any) {
    errorMessage.value = error.message
    MessagePlugin.error(`上传失败：${error.message}`)
  } finally {
    inputLoading.value = false
    uploadProgress.value = 0
  }
}

// 多文件上传处理
async function handleMultiFileUpload() {
  const files = Array.from(multiInputRef.value?.files || [])
  if (files.length === 0) return

  multiLoading.value = true
  uploadingFiles.value = files.map((file) => ({
    name: file.name,
    progress: 0
  }))

  const uploadPromises = files.map(async (file, index) => {
    const cosOptions = {
      Bucket,
      Region,
      path: '/demo/batch/',
      getAuthorization: getAuthorization,
      onProgress: (res) => {
        uploadingFiles.value[index].progress = Math.round(res.percent * 100)
      }
    }

    try {
      const result = await uploadFileToCos(cosOptions, file)
      if (result.data) {
        return { url: result.data.url, name: file.name }
      }
      return null
    } catch (error) {
      console.error(`文件 ${file.name} 上传失败：`, error)
      return null
    }
  })

  const results = await Promise.all(uploadPromises)
  const successFiles = results.filter(Boolean) as Array<{ url: string; name: string }>

  multiFiles.value.push(...successFiles)
  MessagePlugin.success(`成功上传 ${successFiles.length} 个文件`)

  multiLoading.value = false
  uploadingFiles.value = []

  // 清空文件选择
  if (multiInputRef.value) {
    multiInputRef.value.value = ''
  }
}

// 带处理的图片上传
async function handleProcessFileUpload() {
  const file = processInputRef.value?.files?.[0]
  if (!file) return

  processLoading.value = true

  // 先上传原图
  const originalOptions = {
    Bucket,
    Region,
    path: '/demo/process/original/',
    getAuthorization: getAuthorization
  }

  try {
    const originalResult = await uploadFileToCos(originalOptions, file)
    if (!originalResult.data) throw new Error('原图上传失败')

    originalImage.value = originalResult.data.url

    // 根据选择的处理类型生成处理规则
    let processRule = ''
    switch (processType.value) {
      case 'thumbnail':
        processRule = '?imageMogr2/thumbnail/500x500'
        break
      case 'watermark':
        processRule = '?watermark/2/text/VCBEZXNpZ24gUHJv/fill/I0ZGRkZGRg/fontsize/20/dissolve/50'
        break
      case 'compress':
        processRule = '?imageMogr2/quality/60'
        break
    }

    // 处理后的图片URL
    processedImage.value = originalImage.value + processRule
    MessagePlugin.success('图片处理完成！')
  } catch (error: any) {
    MessagePlugin.error(`处理失败：${error.message}`)
  } finally {
    processLoading.value = false
  }
}

// 移除文件
const removeFile = (index: number) => {
  multiFiles.value.splice(index, 1)
}

// 复制URL
const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(imageSrc.value)
    MessagePlugin.success('链接已复制到剪贴板')
  } catch {
    MessagePlugin.error('复制失败，请手动复制')
  }
}
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

.custom-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-input {
  display: none;
}

.file-count {
  color: var(--td-text-color-secondary);
  font-size: 14px;
}

.progress-bar {
  margin-top: 16px;
}

.progress-text {
  display: inline-block;
  margin-left: 12px;
  color: var(--td-text-color-brand);
  font-size: 12px;
}

.upload-result {
  margin-top: 20px;
  padding: 16px;
  background: var(--td-bg-color-component);
  border-radius: var(--td-radius-default);
}

.image-preview {
  margin-bottom: 12px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: var(--td-radius-default);
}

.image-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-info p {
  margin: 0;
  color: var(--td-text-color-secondary);
  font-size: 12px;
  white-space: nowrap;
}

.error-message {
  margin-top: 16px;
}

.uploading-list {
  margin-top: 16px;
  padding: 12px;
  background: var(--td-bg-color-component);
  border-radius: var(--td-radius-default);
}

.uploading-list h5 {
  margin-bottom: 12px;
  color: var(--td-text-color-secondary);
  font-size: 12px;
}

.uploading-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.file-name {
  min-width: 120px;
  color: var(--td-text-color-primary);
  font-size: 12px;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.file-card {
  position: relative;
  padding-top: 100%;
  background: var(--td-bg-color-component);
  border-radius: var(--td-radius-default);
  overflow: hidden;
}

.file-card img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 255, 255, 0.9);
}

.compare-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.image-box {
  text-align: center;
}

.image-box h5 {
  margin-bottom: 8px;
  color: var(--td-text-color-secondary);
  font-size: 14px;
}

.image-box img {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border: 1px solid var(--td-border-color);
  border-radius: var(--td-radius-default);
}
</style>
