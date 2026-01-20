<template>
  <div>
    <t-space direction="vertical" :size="40">
      <div>
        <p>通过普通input元素上传图片</p>
        <input ref="inputRef" type="file" @change="handleFileUpload" />
        <p v-if="inputLoading">正在上传</p>
        <div v-if="imageSrc">
          <img
            style="
              width: 100px;
              height: 100px;
              object-fit: cover;
              margin-top: 10px;
            "
            :src="imageSrc"
            alt=""
          />
        </div>
      </div>
    </t-space>
  </div>
</template>

<script setup lang="ts">
import { ProgressInfo } from 'cos-js-sdk-v5'
import { uploadFileToCos } from 't-design-pro'
import { ref } from 'vue'

import getAuthorization from './getAuthorization'
const Bucket = import.meta.env.VITE_COS_BUCKET
const inputRef = ref<HTMLInputElement | null>(null)
const imageSrc = ref<string>('')

const cosOptions = {
  Bucket,
  Region: 'ap-shanghai',
  path: '/lai-pro/cosupload/',
  getAuthorization: getAuthorization,
  onProgress: (res: ProgressInfo) => {
    console.log('上传进度', res)
  }
}
const inputLoading = ref(false)
async function handleFileUpload() {
  console.log(inputRef.value?.files)
  const file = inputRef.value?.files?.[0]
  console.log(file)
  if (!file) return

  inputLoading.value = true
  const result = await uploadFileToCos(cosOptions, file).finally(() => {
    inputLoading.value = false
  })

  if (!result.data) return

  imageSrc.value = result.data.url
}
</script>

<style lang="less" scoped></style>
