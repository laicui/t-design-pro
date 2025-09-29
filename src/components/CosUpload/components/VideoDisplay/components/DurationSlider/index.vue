<template>
  <div class="duration-slider">
    <div ref="sliderRef" class="slider">
      <div class="slider-rail"></div>
      <div
        class="slider-button"
        :style="{ left: `calc(${currentPos} - 7px)` }"
        @mousedown="onButtonDown"
        @touchstart="onButtonDown"
      >
        <img class="slider-button-icon" src="./up.png" />
      </div>
      <div class="marked-scale-bar">
        <div v-for="item in markedScales" :key="item.key" class="marked-scale">
          <div class="marked"></div>
          <div class="marked-text">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

interface IProps {
  modelValue: number
  duration: number
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: 0,
  duration: 0
})

const emit = defineEmits(['update:modelValue', 'dragEnd'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const sliderSize = ref(500)

const slideButtonProps = reactive({
  dragging: false,
  isClick: false,
  startX: 0,
  startPos: 0,
  newPos: null
})

const currentPos = computed(() => {
  return `${(value.value / props.duration) * 100}%`
})

const setPosition = (pos: number, isDragEnd = false) => {
  let newPos = pos
  if (newPos === null || Number.isNaN(newPos)) {
    return
  }

  if (newPos > 100) {
    newPos = 100
  } else if (newPos < 0) {
    newPos = 0
  }
  const perStepLen = (100 * 1) / props.duration
  const steps = Math.round(newPos / perStepLen)
  let value = steps * perStepLen * props.duration * 0.01
  value = Math.floor(value)
  emit('update:modelValue', value)
  if (isDragEnd) {
    emit('dragEnd', value)
  }
}

const onDragStart = (event: MouseEvent | TouchEvent) => {
  slideButtonProps.dragging = true
  slideButtonProps.isClick = true
  const { type } = event
  let { clientX } = event as MouseEvent
  if (type === 'touchstart') {
    const touch = (event as TouchEvent).touches
    clientX = touch[0].clientX
  }
  slideButtonProps.startX = clientX
  slideButtonProps.startPos = parseFloat(currentPos.value)
  slideButtonProps.newPos = slideButtonProps.startPos
}

const onDragging = (e: MouseEvent | TouchEvent) => {
  const event = e
  if (!slideButtonProps.dragging) {
    return
  }
  slideButtonProps.isClick = false
  let diff = 0
  diff = (event as MouseEvent).clientX - slideButtonProps.startX
  diff = (diff / sliderSize.value) * 100
  slideButtonProps.newPos = slideButtonProps.startPos + diff
  setPosition(slideButtonProps.newPos)
}

const onDragEnd = () => {
  if (slideButtonProps.dragging) {
    setTimeout(() => {
      slideButtonProps.dragging = false
      if (!slideButtonProps.isClick) {
        setPosition(slideButtonProps.newPos, true)
      }
    }, 0)
    window.removeEventListener('mousemove', onDragging)
    window.removeEventListener('touchmove', onDragging)
    window.removeEventListener('mouseup', onDragEnd)
    window.removeEventListener('touchend', onDragEnd)
    window.removeEventListener('contextmenu', onDragEnd)
  }
}

const onButtonDown = (event: MouseEvent | TouchEvent) => {
  event.preventDefault()
  onDragStart(event)
  window.addEventListener('mousemove', onDragging)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchmove', onDragging)
  window.addEventListener('touchend', onDragEnd)
  window.addEventListener('contextmenu', onDragEnd)
}

const formatDuration = (seconds: number) => {
  const m = seconds > 60 ? Math.floor(seconds / 60) : 0
  const s = seconds % 60
  return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
}
const markedScales = computed(() => {
  const duration = Math.floor(props.duration)
  const averageValue = duration > 4 ? Math.floor(duration / 4) : 1
  const marks = []
  const steps = 5
  for (let i = 0; i < steps; i++) {
    marks.push({
      key: i,
      text: formatDuration(i * averageValue)
    })
  }
  return marks
})
</script>

<style lang="less" scoped>
.duration-slider {
  width: 500px;
  padding-bottom: 20px;

  .slider {
    width: 100%;
    height: calc(var(--td-comp-paddingTB-xs) * 2 + var(--td-size-2));
    position: relative;
    padding: var(--td-comp-paddingTB-xs) 0;

    .slider-rail {
      width: 100%;
      height: 100%;
      background-color: var(--td-bg-color-secondarycomponent);
      transition: 0.2s linear;
      border-radius: var(--td-radius-round);
    }

    .slider-button {
      width: 14px;
      position: absolute;
      bottom: 4px;
      cursor: pointer;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;

      .slider-button-icon {
        width: 100%;
      }
    }

    .marked-scale-bar {
      display: flex;
      justify-content: space-between;

      .marked-scale {
        display: flex;
        flex-direction: column;
        align-items: center;

        &:first-child {
          .marked {
            width: 0;
          }
        }

        &:last-child {
          .marked {
            width: 0;
          }
        }
        .marked {
          width: 1px;
          height: var(--td-size-2);
          background-color: var(--td-bg-color-secondarycomponent);
        }
        .marked-text {
          font: var(--td-font-body-small);
          color: var(--td-text-color-primary);
        }
      }
    }
  }
}
</style>
