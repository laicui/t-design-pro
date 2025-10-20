<template>
  <div class="demo-container">
    <div class="demo-item">
      <p class="demo-label">基础开关：</p>
      <SwitchPro v-model="value" />
      <span class="demo-value">当前值：{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SwitchPro } from 't-design-pro'
import { ref } from 'vue'

const value = ref<boolean>(false)
</script>

<style scoped>
.demo-container {
  padding: 16px;
}

.demo-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.demo-label {
  margin: 0 16px 0 0;
  color: var(--td-text-color-secondary);
}

.demo-value {
  margin-left: 16px;
  color: var(--td-text-color-primary);
}
</style>