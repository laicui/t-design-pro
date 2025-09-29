<template>
  <div class="files-list">
    <t-list size="small" split>
      <t-list-item v-for="(file, index) in displayFiles" :key="file.key">
        <a :href="file.url" target="_blank">{{ formatName(file.name) }}</a>
        <template #action>
          <t-button
            variant="text"
            shape="square"
            :disabled="disabled || file.status === 'progress'"
            @click="deleteFile(index)"
          >
            <loading-icon v-if="file.status === 'progress'" />
            <delete-icon v-else />
          </t-button>
        </template>
      </t-list-item>
    </t-list>
  </div>
</template>
<script setup lang="ts">
import { DeleteIcon, LoadingIcon } from 'tdesign-icons-vue-next'
import { computed } from 'vue'

interface Props {
  files: any[]
  waitingUploadFiles: Array<any>
  abridgeName?: Array<number>
  disabled: boolean
}

const props = withDefaults(defineProps<Props>(), {
  files: () => [],
  waitingUploadFiles: () => [],
  abridgeName: () => [6, 6],
  disabled: false
})

const emit = defineEmits(['deleteItem'])

const deleteFile = (index: number) => {
  emit('deleteItem', index)
}

const displayFiles = computed(() => {
  return [...props.files, ...props.waitingUploadFiles]
})

const formatName = (name: string) => {
  if (props.abridgeName && props.abridgeName.length === 2) {
    const halfLength = name.length / 2
    if (props.abridgeName[0] < halfLength && props.abridgeName[1] < halfLength) {
      const startStr = name.slice(0, props.abridgeName[0])
      const endStr = name.slice(-props.abridgeName[1], name.length)
      return `${startStr}...${endStr}`
    }
    return name
  }
  return name
}
</script>

<style lang="less" scoped>
.files-list {
  width: 100%;
}
</style>
