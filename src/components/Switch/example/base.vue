<template>
  <div>
    <h2>异步Switch调试</h2>
    <SwitchPro :model-value="booleanValue" :request="request" @change="onChange" />
    <p>当前值：{{ booleanValue }}</p>

    <h2>非异步Switch调试 custom-value="[1, 0]"</h2>
    <SwitchPro v-model="numberValue" :custom-value="[1, 0]" />
    <p>当前值：{{ numberValue }}</p>
  </div>
</template>

<script setup lang="ts">
import { SwitchPro } from 't-design-pro'
import { SwitchValue } from 'tdesign-vue-next'
import { ref } from 'vue'

const booleanValue = ref<SwitchValue>(false)
const numberValue = ref<SwitchValue>(0)

const request = () => {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

const onChange = (value: SwitchValue) => {
  booleanValue.value = value
}
</script>

<style scoped></style>
