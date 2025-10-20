<template>
  <t-switch
    :model-value="modelValue"
    :custom-value="customValue"
    :loading="loading"
    :before-change="beforeChange"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { Switch as TSwitch, SwitchValue } from 'tdesign-vue-next'
import { ref } from 'vue'

import { SwitchProProps } from './types'

const { modelValue, request, customValue = [true, false] } = defineProps<SwitchProProps>()

const emit = defineEmits<{
  change: [value: SwitchValue]
  'update:modelValue': [value: SwitchValue]
}>()

const loading = ref<boolean>(false)

const beforeChange = async () => {
  if (request) {
    loading.value = true
    const result = await request()
    loading.value = false
    return result
  }
  return true
}

const onChange = (value: SwitchValue) => {
  emit('change', value)
  emit('update:modelValue', value)
}
</script>

<style scoped></style>
