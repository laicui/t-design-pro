<template>
  <div class="video-display">
    <div class="video-display-box">
      <t-loading
        size="small"
        style="height: 120px"
        :loading="displayFiles[0].status === 'progress'"
        show-overlay
      >
        <!-- 视频播放器 -->
        <video
          v-if="renderVideo"
          ref="videoRef"
          class="video-class"
          :src="displayFiles[0].url"
          :width="120"
          :height="120"
        ></video>
        <div class="mask">
          <t-space align="center" size="0">
            <browse-icon class="icon-button" @click="openPreview()" />
            <file-image-icon
              v-if="!disabled"
              class="icon-button"
              @click="openSelectPoster()"
            />
            <delete-icon
              v-if="!disabled"
              class="icon-button"
              @click="deleteFile()"
            />
            <template #separator>
              <t-divider layout="vertical" />
            </template>
          </t-space>
        </div>
      </t-loading>
    </div>

    <!-- 预览视频弹窗 -->
    <t-dialog
      v-model:visible="visibleVideoPreview"
      attach="body"
      width="800px"
      :top="20"
      :footer="false"
      @opened="onVideoPreviewOpened"
      @closed="onClosedVideoPreview"
    >
      <div class="player-container">
        <video
          v-if="renderVideo"
          ref="videoPlayer"
          class="video-js"
          :poster="poster[0]?.url"
          :src="files[0].url"
        ></video>
      </div>
    </t-dialog>

    <!-- 选择视频封面弹窗 -->
    <t-dialog
      v-model:visible="visibleSelectPoster"
      header="选择视频封面"
      attach="body"
      width="584px"
      @opened="onSelectPosterOpened"
      @closed="onClosedSelectPoster"
      @confirm="confirmPoster"
    >
      <t-loading
        size="small"
        style="min-height: 290px"
        :loading="gettingScreenshot"
        show-overlay
      >
        <div v-if="currentSelectedPoster.length > 0" class="poster-preview">
          <img :src="currentSelectedPoster[0].url" />
        </div>
        <div v-if="screenshotImages.length > 0" class="screenshot-control">
          <div class="screenshot-container">
            <img
              v-for="item in screenshotImages"
              :key="item.key"
              :src="item.url"
            />
          </div>
          <duration-slider
            v-model="currentDuration"
            :duration="displayFiles[0]?.response?.duration"
            @drag-end="onDurationSliderDragEnd"
          />
        </div>
      </t-loading>
    </t-dialog>
  </div>
</template>
<script setup lang="ts">
import 'video.js/dist/video-js.css'

import { BrowseIcon, DeleteIcon, FileImageIcon } from 'tdesign-icons-vue-next'
import { v4 as uuidv4 } from 'uuid'
import videojs from 'video.js'
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'

import CosInstance from '../../CosInstance'
import DurationSlider from './components/DurationSlider/index.vue'

interface Props {
  files: any[]
  poster?: Array<any>
  waitingUploadFiles: Array<any>
  disabled: boolean
  bucketType?: 'private' | 'public'
}

const props = withDefaults(defineProps<Props>(), {
  files: () => [],
  poster: () => [],
  waitingUploadFiles: () => [],
  disabled: false
})

// 实例化COS，目前用到视频截帧的只有商品视频，属于公开资源，直接写死桶类型
const COSUtil = new CosInstance({
  bucketType: props.bucketType
})

const displayFiles = computed(() => {
  if (props.waitingUploadFiles.length > 0) {
    return props.waitingUploadFiles
  }
  return props.files
})

const renderVideo = computed(() => {
  return !!displayFiles.value?.[0]?.url
})

// 监听文件变化，初始化视频封面
watch(
  () => renderVideo.value,
  (val) => {
    if (val === true) {
      initPoster(displayFiles.value[0])
    }
  }
)

const emit = defineEmits(['deleteItem', 'updatePoster'])

const transformBlobToFilesObject = (blobData) => {
  // 将Blob对象转换为File对象
  const filename = `${uuidv4()}.jpeg`
  const file = new File([blobData], filename, { type: blobData.type })
  const { lastModified, name, size, type } = file
  return [
    { lastModified, name, size, type, raw: file, status: 'waiting', percent: 0 }
  ]
}

const initPoster = async (video) => {
  const res = await getVideoSnapshotByTime(video, 0)
  const posterFiles = transformBlobToFilesObject(res.Body)
  emit('updatePoster', posterFiles)
}

// 自定义选择封面相关逻辑
const gettingScreenshot = ref(false)
const currentDuration = ref(0)
const screenshotImages = ref([])
const currentSelectedPoster = ref([])
const visibleSelectPoster = ref(false)
const openSelectPoster = () => {
  visibleSelectPoster.value = true
}

const onSelectPosterOpened = () => {
  initScreenshot()
}

const onClosedSelectPoster = () => {
  currentSelectedPoster.value = []
  screenshotImages.value = []
  currentDuration.value = 0
}

const confirmPoster = () => {
  const posterFiles = transformBlobToFilesObject(
    currentSelectedPoster.value[0].Body
  )
  emit('updatePoster', posterFiles)
  visibleSelectPoster.value = false
}

const initScreenshot = async () => {
  gettingScreenshot.value = true
  const video = props.files[0]
  const screenshotTotal = 10
  const instances = []
  for (let i = 0; i < screenshotTotal; i++) {
    instances.push(
      COSUtil.getVideoSnapshot(
        video.response.key,
        Math.floor((video.response.duration / screenshotTotal) * i)
      )
    )
  }
  Promise.all(instances)
    .then((res) => {
      screenshotImages.value = res.map((item) => {
        const key = `${uuidv4()}.jpeg`
        return {
          key,
          Body: item.Body,
          url: URL.createObjectURL(item.Body)
        }
      })
      currentSelectedPoster.value = [screenshotImages.value[0] as any]
    })
    .finally(() => {
      gettingScreenshot.value = false
    })
}

const getVideoSnapshotByTime = async (video, time: number) => {
  gettingScreenshot.value = true
  const res: any = await COSUtil.getVideoSnapshot(video.response.key, time)
  gettingScreenshot.value = false
  return res
}

// 触发请求选择的时间点封面
const onDurationSliderDragEnd = async (time: number) => {
  const video = props.files[0]
  const res = await getVideoSnapshotByTime(video, time)
  currentSelectedPoster.value = [
    {
      Body: res.Body,
      url: URL.createObjectURL(res.Body)
    }
  ]
}

// 初始化视频预览弹窗相关逻辑
const visibleVideoPreview = ref(false)

const openPreview = () => {
  visibleVideoPreview.value = true
}

const onVideoPreviewOpened = () => {
  initVideojs()
}

const onClosedVideoPreview = () => {
  // 销毁播放器和插件实例
  if (player.value) {
    player.value.pause()
  }
}

const player: any = ref(null)
const videoRef = ref(null)
const videoPlayer = ref(null)

const initVideojs = async () => {
  await nextTick()
  if (player.value) {
    return
  }

  player.value = videojs(videoPlayer.value, {
    controls: true
  })
}

onUnmounted(() => {
  // 销毁播放器和插件实例
  if (player.value) {
    player.value.dispose()
    player.value = null
  }
})

const deleteFile = () => {
  emit('deleteItem', 0)
}
</script>

<style lang="less" scoped>
.video-display {
  width: 100%;
  margin-top: 16px;

  .video-display-box {
    width: 132px;
    height: 132px;
    border: 1px dashed var(--td-component-border);
    border-radius: 4px;
    padding: 5px;
    position: relative;

    .video-class {
      width: 100%;
      height: 100%;

      video {
        width: 100%;
        height: 100%;
      }
    }

    .mask {
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

      & :deep(.t-divider--vertical) {
        margin: 6px;
      }
    }
  }
}

.player-container {
  width: 100%;
  height: calc(100vh - 200px);

  .video-js {
    width: 100%;
    height: 100%;

    video {
      width: 100%;
      height: 100%;
    }
  }
}

.poster-preview {
  width: 100%;
  height: 200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.screenshot-control {
  position: relative;
  margin-top: 12px;
  padding: 8px;
  border: 1px dashed var(--td-component-border);
  border-radius: 4px;

  .screenshot-container {
    width: 500px;
    display: flex;

    img {
      width: 50px;
    }
  }
}
</style>
