<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, toRef } from 'vue'

import { IConfigProviderProps } from './types/index'

const props = withDefaults(defineProps<IConfigProviderProps>(), {
  locale: 'zh-CN'
})
const locale = toRef(props, 'locale')
provide('lai-locale', locale)
</script>

<style></style>
