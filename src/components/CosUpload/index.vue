<template>
  <div>
    <t-upload
      ref="uploadRef"
      v-model="value"
      class="cos-upload"
      :class="size === 'small' ? 'small' : ''"
      :request-method="requestMethod"
      :theme="transformTheme"
      :max="theme === 'video' ? 1 : max"
      :multiple="max > 1"
      :disabled="disabled || uploading"
      :trigger-button-props="{ theme: 'primary', variant: 'base' }"
      :upload-button="{ loading: uploading }"
      :accept="props.accept"
      :show-image-file-name="false"
      v-bind="props.uploadExpandOptions"
      @waiting-upload-files-change="waitingUploadFilesChange"
      @success="uploadSuccess"
    >
      <template
        v-if="
          theme === 'image-sortable' ||
          theme === 'video' ||
          theme === 'files-list'
        "
      >
        <t-button
          v-if="theme === 'image-sortable' && !disabled"
          :disabled="disabled || (max > 0 && value.length >= max)"
          :loading="uploading"
        >
          <template #icon><upload-icon /></template>
          {{ value.length === 0 ? `选择图片` : '继续选择' }}
        </t-button>
        <t-button v-if="theme === 'video' && !disabled" :loading="uploading">
          <template #icon><upload-icon /></template>
          {{ value.length === 0 ? `选择视频` : '重新选择' }}
        </t-button>
        <t-button
          v-if="theme === 'files-list' && !disabled"
          :loading="uploading"
        >
          <template #icon><upload-icon /></template>
          <slot name="filesListButtonTitle">上传文件</slot>
        </t-button>
      </template>
      <template v-else-if="$slots.default">
        <slot></slot>
      </template>
      <template
        v-if="
          theme === 'image-sortable' ||
          theme === 'video' ||
          theme === 'files-list'
        "
        #fileListDisplay
      >
        <images-sortable
          v-if="
            theme === 'image-sortable' &&
            (value.length > 0 || waitingUploadFiles.length > 0)
          "
          :files="value"
          :disabled="disabled"
          :waiting-upload-files="waitingUploadFiles"
          :abridge-name="abridgeName"
          @delete-item="deleteItem"
          @sort-end="sortEnd"
        >
          <template #imageCoverIcon="{ item }">
            <component
              :is="($slots as any).imageCoverIcon"
              :item="item"
            ></component>
          </template>
        </images-sortable>
        <video-display
          v-if="
            theme === 'video' &&
            (value.length > 0 || waitingUploadFiles.length > 0)
          "
          :files="value"
          :poster="poster"
          :disabled="disabled"
          :waiting-upload-files="waitingUploadFiles"
          @delete-item="deleteItem"
          @update-poster="updatePoster"
        />
        <files-list
          v-if="
            theme === 'files-list' &&
            (value.length > 0 || waitingUploadFiles.length > 0)
          "
          :files="value"
          :disabled="disabled"
          :waiting-upload-files="waitingUploadFiles"
          :abridge-name="abridgeName"
          @delete-item="deleteItem"
        />
      </template>
    </t-upload>
    <t-loading
      v-if="loadingAttach"
      :loading="isUploadLoading"
      size="small"
      :attach="getLoadingAttach"
    />
  </div>
</template>
<script setup lang="ts">
import { arrayMoveImmutable } from 'array-move'
import dayjs from 'dayjs'
import { UploadIcon } from 'tdesign-icons-vue-next'
import {
  Button as TButton,
  Loading as TLoading,
  MessagePlugin,
  Upload as TUpload,
  Upload,
  UploadInstanceFunctions
} from 'tdesign-vue-next'
import { computed, ComputedRef, ref } from 'vue'

import { getVideoTime, isSizeWithinMax } from '@/utils/index'

import FilesList from './components/FilesList/index.vue'
import ImagesSortable from './components/ImagesSortable/index.vue'
import VideoDisplay from './components/VideoDisplay/index.vue'
import CosInstance from './CosInstance'

const uploadRef = ref<
  (InstanceType<typeof Upload> & UploadInstanceFunctions) | null
>(null)
const uploading = ref(false)
import type { ICosUploadProps } from './types'
const props = withDefaults(defineProps<ICosUploadProps>(), {
  max: 1,
  disabled: false,
  size: 'default'
})

defineOptions({
  inheritAttrs: false,
  name: 'CosUpload'
})

// 实例化COS
const COSUtil = new CosInstance(props.cosOptions)

const emit = defineEmits([
  'update:modelValue',
  'updatePoster',
  'uploadSuccess',
  'update:loading'
])

const value = computed({
  get() {
    return (
      props.modelValue?.map((item) => {
        return {
          ...item,
          response: item,
          status: 'success',
          uploadTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      }) || []
    )
  },
  set(value) {
    emit(
      'update:modelValue',
      value.map((item) => ({
        ...item.response,
        status: undefined,
        uploadTime: undefined
      }))
    )
  }
})

// 兼容props.loading没传的情况
const isUploadLoadingIsPrivate = ref(props.loading)

const isUploadLoading = computed({
  get() {
    return isUploadLoadingIsPrivate.value
  },
  set(value: boolean) {
    isUploadLoadingIsPrivate.value = value
    emit('update:loading', value)
  }
})

const getLoadingAttach = computed(() => {
  if (!props.loadingAttach) {
    return ''
  }

  if (typeof props.loadingAttach === 'boolean') {
    return 'body'
  }

  return props.loadingAttach
})

const waitingUploadFiles = ref([])
const waitingUploadFilesChange = ({ files }) => {
  waitingUploadFiles.value = files
}

type ThemeType =
  | 'file'
  | 'custom'
  | 'image'
  | 'file-input'
  | 'file-flow'
  | 'image-flow'

const fileType = ['image-sortable', 'video', 'files-list', 'audio']

const transformTheme: ComputedRef<ThemeType> = computed(() => {
  if (fileType.includes(props.theme || '')) {
    return 'file'
  }
  return props.theme as ThemeType
})
const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    if (window.URL && typeof window.URL.createObjectURL === 'function') {
      const temporaryURL = URL.createObjectURL(file)
      resolve(temporaryURL)
      return
    }
    const reader = new FileReader()

    reader.onload = (event) => {
      resolve(event.target?.result)
    }

    reader.onerror = (event) => {
      reject(event.target?.error)
    }
    reader.readAsDataURL(file)
  })
}

const requestMethod: any = async (file) => {
  const handleFile = Array.isArray(file) ? file[0] : file

  if (props.theme === 'video' && props.videoMaxduration) {
    const getVideoTimeLen = (await getVideoTime(handleFile.raw)) as number
    if (parseInt(getVideoTimeLen.toFixed(), 10) > props.videoMaxduration) {
      MessagePlugin.warning(`上传的视频时长不能超过${props.videoMaxduration}秒`)
      return null
    }
  }

  if (props.maxFileSize) {
    const { size, unit } = props.maxFileSize
    if (isSizeWithinMax(handleFile.size, size, unit)) {
      const tips = `上传的文件或图片不能大于${size}${unit}`
      MessagePlugin.warning(tips)
      return null
    }
  }

  // 如果是audio 跳过自动上传oss

  if (props.theme === 'audio') {
    const temporaryURL = await readFileAsDataURL(handleFile.raw)

    return {
      status: 'success',
      response: {
        ...file,
        // 返回一个可提供临时播放的blobURL
        url: temporaryURL
      }
    }
  }
  uploading.value = true
  const handleOssExtendOptions = {
    ...props.ossExtendOptions
  }
  const contentDisposition = handleOssExtendOptions.ContentDisposition
  if (contentDisposition) {
    // 如果没传filename 则自动根据文件名拼接
    if (
      contentDisposition.includes('attachment') &&
      !contentDisposition.includes('filename')
    ) {
      // 在safari中，不会对filename进行解码，这里filename*可兼容safari
      // 当有filename*时，优先使用filename* 都不存在时，浏览器默认取URL中的后缀作为文件名。
      handleOssExtendOptions.ContentDisposition += `filename=${encodeURIComponent(
        handleFile.name
      )};filename* =UTF-8''${encodeURIComponent(handleFile.name)}`
    }
  }
  isUploadLoading.value = true
  const result: any = await COSUtil.uploadFile({
    file: handleFile,
    path: props.path,
    pictureHandleRule: props.pictureHandleRule,
    onProgress(progressData) {
      file.percent = progressData.percent * 100
    }
  }).finally(() => {
    isUploadLoading.value = false
  })

  uploading.value = false

  if (result.err === null) {
    emit('uploadSuccess', result.data)
    return { status: 'success', response: result.data }
  }

  return { status: 'fail', error: result.err.message, response: {} }
}

const deleteItem = (index: number) => {
  value.value.splice(index, 1)
  emit(
    'update:modelValue',
    value.value.map((item) => item.response)
  )
  emit(
    'updatePoster',
    value.value.map((item) => item.response)
  )
}

const sortEnd = (sortEvt: { oldIndex: number; newIndex: number }) => {
  const filesList = arrayMoveImmutable(
    value.value,
    sortEvt.oldIndex,
    sortEvt.newIndex
  )
  emit(
    'update:modelValue',
    filesList.map((item) => item.response)
  )
}

const updatePoster = (files) => {
  emit('updatePoster', files)
}

const uploadFiles = (files) => {
  isUploadLoading.value = true
  uploadRef.value?.uploadFiles(files)
}

const uploadSuccess = () => {
  isUploadLoading.value = false
}

defineExpose({
  uploadFiles
})
const hideUploadTrigger = computed(() => (props.disabled ? 'none' : 'block'))
const sortableContainerMargin = computed(() =>
  props.disabled ? '0' : 'var(--td-comp-margin-l)'
)
</script>

<style lang="less" scoped>
:deep(.t-upload__trigger) {
  display: v-bind(hideUploadTrigger);
}
:deep(.sortable-container) {
  margin-top: v-bind(sortableContainerMargin);
}
.cos-upload {
  & :deep(.t-upload__dragger) {
    width: 369px;

    .t-upload__dragger-progress-info {
      max-width: none;
    }
  }

  &.small {
    :deep(.t-upload__card-container) {
      width: 80px;
      height: 80px;
    }

    :deep(.t-upload__card-content) {
      width: 80px;
      height: 80px;
    }
  }
}
:deep(.t-upload__single-name) {
  width: 260px;
}
</style>
