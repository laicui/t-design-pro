<template>
  <div class="sortable-container">
    <ul
      ref="sortableRef"
      class="sortable-card"
      :class="sorting ? 'sorting' : ''"
    >
      <li
        v-for="(item, index) in displayFiles"
        :key="item.url || item.name"
        class="sortable-item"
        :class="disabled ? 'disabled' : ''"
      >
        <t-loading
          size="small"
          :loading="item.status === 'progress'"
          show-overlay
        >
          <div class="sortable-item-content">
            <img class="sortable-item-content-img" :src="item.url" />
            <div class="sortable-item-content-mask">
              <t-space align="center" size="0" style="cursor: pointer">
                <browse-icon class="icon-button" @click="openPreview(index)" />
                <delete-icon
                  v-if="!disabled"
                  class="icon-button"
                  @click="deleteItem(index)"
                />
                <slot name="imageCoverIcon" :item="item"></slot>
                <template #separator>
                  <t-divider layout="vertical" />
                </template>
              </t-space>
            </div>
          </div>
        </t-loading>
        <p v-if="false">{{ formatName(item.name) }}</p>
      </li>
    </ul>
    <t-image-viewer
      v-model:visible="visibleImgViewer"
      v-model:index="currentPreviewIndex"
      :images="images"
      :draggable="false"
    ></t-image-viewer>
  </div>
</template>
<script setup lang="ts">
import Sortable from 'sortablejs'
import { BrowseIcon, DeleteIcon } from 'tdesign-icons-vue-next'
import {
  Divider as TDivider,
  ImageViewer as TImageViewer,
  Loading as TLoading,
  Space as TSpace
} from 'tdesign-vue-next'
import { computed, onMounted, ref, watch } from 'vue'

const sortableRef = ref<any>(null)
const sortableInstance = ref(null)
const sorting = ref(false)
onMounted(() => {
  sortableInstance.value = new Sortable(sortableRef.value, {
    disabled: props.disabled,
    animation: 150,
    ghostClass: 'ghost-class',
    onStart: () => {
      sorting.value = true
    },
    onEnd: (evt) => {
      sorting.value = false

      sortEnd({ oldIndex: evt.oldIndex, newIndex: evt.newIndex })
    }
  })
})

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

watch(
  () => props.disabled,
  (newVal) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    sortableInstance.value.option('disabled', newVal)
  }
)

const displayFiles = computed(() => {
  return [...props.files, ...props.waitingUploadFiles]
})

const emit = defineEmits(['deleteItem', 'sortEnd'])

const formatName = (name: string) => {
  if (props.abridgeName) {
    const startStr = name.slice(0, props.abridgeName[0])
    const endStr = name.slice(-props.abridgeName[1], name.length)
    return `${startStr}...${endStr}`
  }
  return name
}

const deleteItem = (index: number) => {
  emit('deleteItem', index)
}

const sortEnd = (sortEvt: { oldIndex: number; newIndex: number }) => {
  emit('sortEnd', sortEvt)
}

const images = computed(() => {
  return props.files.map((item) => item.url)
})
const currentPreviewIndex = ref(0)
const visibleImgViewer = ref(false)
const openPreview = (index: number) => {
  currentPreviewIndex.value = index
  visibleImgViewer.value = true
}
</script>

<style lang="less" scoped>
.sortable-container {
  border: 1px dashed var(--td-component-border);
  padding: var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-m);
  margin-top: var(--td-comp-margin-l);
  transition: border 0.2s linear;
  //min-width: 498px;
  width: fit-content;
  max-width: 960px;

  .sortable-card {
    font: var(--td-font-body-small);
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--td-comp-margin-s);

    &.sorting {
      .sortable-item-content-mask {
        opacity: 0 !important;
      }
    }

    .sortable-item {
      cursor: move;
      box-sizing: border-box;
      list-style: none;

      &.disabled {
        cursor: not-allowed;
      }

      .sortable-item-content {
        position: relative;
        width: 110px;
        height: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        background-color: var(--td-bg-color-secondarycontainer);
        border: 1px solid var(--td-component-border);
        padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
        border-radius: var(--td-radius-default);

        &-img {
          max-width: 100%;
          max-height: 100%;
        }

        &-mask {
          background-color: var(--td-mask-active);
          color: var(--td-text-color-anti);
          will-change: transform;
          opacity: 0;
          transition: opacity 0.1s linear;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;

          &:hover {
            opacity: 1;
          }

          &:active {
            opacity: 0;
          }
        }
      }
    }
  }
}

.ghost-class {
  box-shadow: 0 0 8px #000;
}
</style>
