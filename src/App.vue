<template>
  <ConfigProviderPro :locale="local">
    <RouterView :key="local" />
  </ConfigProviderPro>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { ConfigProviderPro } from 't-design-pro'

import { localeConfigKey } from './locales'

// 内部测试直接响应式修改本地存储。在实际项目中，可自由传递locale来源。
const local = useLocalStorage(localeConfigKey, 'zh-CN')
</script>

<style></style>
