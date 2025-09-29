<template>
  <div class="flex">
    <t-space direction="vertical" :size="40">
      <div>
        <span>theme = file</span>
        <CosUpload
          path="/lai-pro/cosupload/"
          v-model="value"
          :cos-options="{
            Bucket: Bucket,
            Region: Region,
            getAuthorization: getAuthorization
          }"
        ></CosUpload>
      </div>

      <div>
        <span>theme = image</span>
        <CosUpload
          path="/lai-pro/cosupload/"
          v-model="value"
          theme="image"
          :cos-options="{
            Bucket: Bucket,
            Region: Region,
            getAuthorization: getAuthorization
          }"
        ></CosUpload>
      </div>

      <div>
        <span>theme = file-input</span>
        <CosUpload
          path="/lai-pro/cosupload/"
          v-model="value"
          theme="file-input"
          :cos-options="{
            Bucket: Bucket,
            Region: Region,
            getAuthorization: getAuthorization
          }"
        ></CosUpload>
      </div>
      <div>
        <span>theme = file-flow</span>
        <CosUpload
          path="/lai-pro/cosupload/"
          v-model="value"
          theme="file-flow"
          :cos-options="{
            Bucket: Bucket,
            Region: Region,
            getAuthorization: getAuthorization
          }"
        ></CosUpload>
      </div>
      <div>
        <span>theme = image-flow</span>
        <CosUpload
          path="/lai-pro/cosupload/"
          v-model="value"
          theme="image-flow"
          :cos-options="{
            Bucket: Bucket,
            Region: Region,
            getAuthorization: getAuthorization
          }"
        ></CosUpload>
      </div>
    </t-space>
  </div>
</template>

<script setup lang="ts">
import { CosUpload } from 't-design-pro'
import { ref } from 'vue'
const Bucket = import.meta.env.VITE_COS_BUCKET

const Region = 'ap-shanghai'
const value = ref<string[]>([])
import getAuthorization from './getAuthorization'
</script>

<style></style>
