<template>
  <div class="demo-preview">
    <ClientOnly>
      <slot></slot>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.demo-preview {
  width: 100%;
  padding: 12px;
}
</style>
