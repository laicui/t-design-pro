---
next: false
---

<script setup>
import BaseUpload from './base.vue'
import ThemeUpload from './theme.vue'
import UtilsUpload from './utils.vue'
</script>

# CosUpload 腾讯云上传组件

基于 TDesign Vue Next 和腾讯云 COS SDK 的增强上传组件，提供图片、视频、文件等多种上传模式。

## 功能特性

- 📤 **腾讯云 COS 集成** - 直接上传文件到腾讯云对象存储
- 🖼️ **多种展示模式** - 支持图片、视频、文件列表等多种展示形式
- 🔄 **拖拽排序** - 图片模式支持拖拽调整顺序
- 🎬 **视频处理** - 支持视频上传、预览和封面选择
- 📁 **文件管理** - 文件列表模式支持多文件管理
- 🎨 **主题定制** - 多种预设主题，满足不同场景需求
- 📱 **响应式设计** - 自适应不同屏幕尺寸
- 🔒 **安全上传** - 支持临时密钥和签名认证
- ⏳ **进度显示** - 实时显示上传进度
- 🚀 **性能优化** - 支持大文件上传和断点续传

## 基础使用

基础的文件上传功能，支持多种常见的上传主题。

::: raw
<BaseUpload />
:::

::: details 查看代码
<<< ./base.vue
:::

## 主题模式

展示不同主题模式的效果，包括图片排序、视频上传、文件列表等。

::: raw
<ThemeUpload />
:::

::: details 查看代码
<<< ./theme.vue
:::

## 工具函数上传

使用 `uploadFileToCos` 工具函数实现自定义上传逻辑。

::: raw
<UtilsUpload />
:::

::: details 查看代码
<<< ./utils.vue
:::

## API

### Props

| 参数                | 说明                                | 类型                                                  | 默认值      |
| ------------------- | ----------------------------------- | ----------------------------------------------------- | ----------- |
| modelValue          | 已上传文件列表，支持 v-model        | `Array<any>`                                          | `[]`        |
| theme               | 上传组件主题                        | `string`                                              | `'file'`    |
| max                 | 最大上传数量                        | `number`                                              | `1`         |
| abridgeName         | 文件名省略配置 [前缀保留, 后缀保留] | `Array<number>`                                       | -           |
| path                | 上传路径（必填）                    | `string`                                              | -           |
| poster              | 视频封面（theme 为 video 时有效）   | `Array<any>`                                          | -           |
| disabled            | 是否禁用                            | `boolean`                                             | `false`     |
| uploadExpandOptions | t-upload 其他支持的属性             | `object`                                              | `{}`        |
| maxFileSize         | 文件大小限制                        | `{ size: number; unit: 'B' \| 'KB' \| 'MB' \| 'GB' }` | -           |
| ossExtendOptions    | COS 扩展配置                        | `Omit<COS.UploadFileParams, omitOssOptions>`          | -           |
| accept              | 接受的文件类型                      | `string`                                              | -           |
| pictureHandleRule   | 图片处理规则                        | `string`                                              | -           |
| loading             | 上传加载状态，支持 v-model:loading  | `boolean`                                             | `false`     |
| loadingAttach       | 加载遮罩挂载位置                    | `boolean \| string`                                   | `false`     |
| size                | 组件尺寸                            | `'small' \| 'default'`                                | `'default'` |
| videoMaxduration    | 视频最大时长（秒）                  | `number`                                              | -           |
| cosOptions          | COS 配置（必填）                    | `CreateCosInstanceOptions`                            | -           |

### CreateCosInstanceOptions COS 配置

| 参数             | 说明               | 类型                                 | 必填 |
| ---------------- | ------------------ | ------------------------------------ | ---- |
| Bucket           | COS 存储桶名称     | `string`                             | 是   |
| Region           | COS 地域           | `string`                             | 是   |
| getAuthorization | 获取临时密钥的方法 | `COS.COSOptions['getAuthorization']` | 是   |

### 主题类型说明

| 主题值             | 说明       | 特性                         |
| ------------------ | ---------- | ---------------------------- |
| `'file'`           | 文件上传   | 基础文件上传，显示文件信息   |
| `'image'`          | 图片上传   | 图片预览模式                 |
| `'file-input'`     | 输入框模式 | 简洁的输入框上传             |
| `'file-flow'`      | 文件流式   | 文件列表流式布局             |
| `'image-flow'`     | 图片流式   | 图片列表流式布局             |
| `'image-sortable'` | 图片排序   | 支持拖拽排序的图片列表       |
| `'video'`          | 视频上传   | 视频上传和预览，支持封面选择 |
| `'files-list'`     | 文件列表   | 详细的文件列表展示           |
| `'audio'`          | 音频上传   | 音频文件上传（本地预览）     |
| `'custom'`         | 自定义     | 通过默认插槽自定义上传按钮   |

### 方法

| 方法名      | 说明             | 参数              | 返回值 |
| ----------- | ---------------- | ----------------- | ------ |
| uploadFiles | 手动触发文件上传 | `(files: File[])` | -      |

### 事件

| 事件名            | 说明                   | 参数                   |
| ----------------- | ---------------------- | ---------------------- |
| update:modelValue | 文件列表变化时触发     | `(value: Array<any>)`  |
| update:loading    | 上传状态变化时触发     | `(loading: boolean)`   |
| updatePoster      | 视频封面更新时触发     | `(poster: Array<any>)` |
| uploadSuccess     | 单个文件上传成功时触发 | `(file: any)`          |

### 插槽

| 插槽名               | 说明                                 | 参数            |
| -------------------- | ------------------------------------ | --------------- |
| default              | 自定义上传按钮（theme 为 custom 时） | -               |
| filesListButtonTitle | 文件列表上传按钮文字                 | -               |
| imageCoverIcon       | 图片覆盖层图标                       | `{ item: any }` |

## 工具函数

### uploadFileToCos

独立的上传函数，可用于自定义上传逻辑。

```typescript
import { uploadFileToCos } from 't-design-pro'

const result = await uploadFileToCos(options, file)
```

#### 参数

| 参数    | 说明         | 类型                     |
| ------- | ------------ | ------------------------ |
| options | 上传配置     | `uploadFileToCosOptions` |
| file    | 要上传的文件 | `File`                   |

#### uploadFileToCosOptions

| 参数             | 说明               | 类型                                       | 必填 |
| ---------------- | ------------------ | ------------------------------------------ | ---- |
| Bucket           | COS 存储桶名称     | `string`                                   | 是   |
| Region           | COS 地域           | `string`                                   | 是   |
| path             | 上传路径           | `string`                                   | 是   |
| getAuthorization | 获取临时密钥的方法 | `Function`                                 | 是   |
| onProgress       | 上传进度回调       | `(progressData: COS.ProgressInfo) => void` | 否   |

## 高级用法

### 配置临时密钥

```javascript
// getAuthorization.js
export default async function getAuthorization(options, callback) {
  // 从后端获取临时密钥
  const response = await fetch('/api/cos/sts', {
    method: 'POST',
    body: JSON.stringify({
      bucket: options.Bucket,
      region: options.Region
    })
  })

  const data = await response.json()

  callback({
    TmpSecretId: data.credentials.tmpSecretId,
    TmpSecretKey: data.credentials.tmpSecretKey,
    SecurityToken: data.credentials.sessionToken,
    ExpiredTime: data.expiredTime
  })
}
```

### 图片处理规则

```vue
<template>
  <CosUpload
    v-model="images"
    theme="image-sortable"
    :cos-options="cosOptions"
    path="/uploads/images/"
    picture-handle-rule="imageMogr2/thumbnail/500x500"
    :max="9"
  />
</template>
```

### 视频上传限制

```vue
<template>
  <CosUpload
    v-model="video"
    theme="video"
    :cos-options="cosOptions"
    path="/uploads/videos/"
    :video-maxduration="60"
    :max-file-size="{ size: 100, unit: 'MB' }"
    accept="video/*"
  />
</template>
```

### 文件下载配置

```vue
<template>
  <CosUpload
    v-model="files"
    theme="files-list"
    :cos-options="cosOptions"
    path="/uploads/files/"
    :oss-extend-options="{
      ContentDisposition: 'attachment'
    }"
  />
</template>
```

### 自定义上传按钮

```vue
<template>
  <CosUpload v-model="files" theme="custom" :cos-options="cosOptions" path="/uploads/">
    <t-button theme="primary" variant="outline">
      <template #icon><cloud-upload-icon /></template>
      点击上传
    </t-button>
  </CosUpload>
</template>
```

### 监听上传进度

```vue
<template>
  <CosUpload
    v-model="files"
    v-model:loading="uploading"
    :cos-options="cosOptions"
    path="/uploads/"
    @upload-success="handleSuccess"
  />
</template>

<script setup>
const uploading = ref(false)

const handleSuccess = (file) => {
  console.log('上传成功：', file)
  MessagePlugin.success('文件上传成功！')
}

watch(uploading, (val) => {
  console.log('上传状态：', val ? '上传中' : '上传完成')
})
</script>
```

## 注意事项

1. **COS 配置**：使用前需要正确配置腾讯云 COS 的 Bucket、Region 和临时密钥获取方法
2. **安全性**：不要在前端直接配置永久密钥，应使用临时密钥方案
3. **文件大小**：大文件上传时建议配置合理的超时时间和重试策略
4. **跨域配置**：需要在 COS 控制台配置正确的 CORS 规则
5. **图片处理**：使用图片处理规则需要开通 COS 的数据处理功能
6. **视频限制**：视频文件较大，建议设置合理的大小和时长限制
7. **并发控制**：多文件上传时，组件会自动控制并发数量
8. **错误处理**：上传失败时会自动显示错误信息，可通过 MessagePlugin 自定义提示

## 常见问题

### 1. 如何获取上传后的文件 URL？

上传成功后，文件信息会包含 `url` 字段：

```javascript
const handleSuccess = (file) => {
  console.log('文件URL：', file.url)
}
```

### 2. 如何实现文件覆盖上传？

在 path 中使用固定的文件名：

```vue
<CosUpload :cos-options="cosOptions" :path="`/uploads/avatar_${userId}.jpg`" />
```

### 3. 如何限制文件类型？

使用 `accept` 属性：

```vue
<CosUpload accept="image/png,image/jpeg" :cos-options="cosOptions" />
```

### 4. 如何自定义文件名？

在 `getAuthorization` 中处理或使用 `path` 属性动态生成：

```javascript
const customPath = computed(() => {
  const timestamp = Date.now()
  return `/uploads/${timestamp}/`
})
```
