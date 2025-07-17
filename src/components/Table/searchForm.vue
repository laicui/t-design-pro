<template>
  <div ref="formContainerRef" class="search-form-container">
    <t-form
      ref="formSearchRef"
      :data="formData"
      colon
      label-width="auto"
      :reset-type="resetType"
      @reset="onReset"
      @submit="onSubmit"
    >
      <t-row :gutter="[16, 16]" justify="space-between">
        <t-col v-for="formItemCol in formItemCols" :key="formItemCol.key" :span="formItemColSpan">
          <t-form-item
            :label-width="formItemCol.labelWidth || 'auto'"
            :label="formItemCol.label"
            :name="formItemCol.key"
          >
            <component
              :is="formItemCol.valueType"
              v-model="formData[formItemCol.key]"
              v-bind="formItemCol.fieldProps"
            />
          </t-form-item>
        </t-col>
        <t-col :span="formItemColSpan" :offset="operationSpanOffset" class="operation-container">
          <t-space :size="16" align="center">
            <t-button
              theme="primary"
              type="submit"
              :style="{ marginLeft: 'var(--td-comp-margin-s)' }"
            >
              搜索
            </t-button>
            <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
            <t-link
              v-if="colsCount - 1 < formItems.length"
              theme="primary"
              hover="color"
              @click="toggleDisplayFormItem"
            >
              <span>{{ showAllFormItem ? '收起' : '展开' }}</span>
              <t-icon :name="showAllFormItem ? 'chevron-up' : 'chevron-down'" />
            </t-link>
          </t-space>
        </t-col>
      </t-row>
    </t-form>
  </div>
</template>
<script setup lang="tsx">
import { useElementSize } from '@vueuse/core'
import {
  Button as TButton,
  Col as TCol,
  Form as TForm,
  FormInstanceFunctions,
  FormItem as TFormItem,
  FormResetParams,
  Row as TRow
} from 'tdesign-vue-next'
import type { VNode } from 'vue'
import { computed, ref, watchEffect } from 'vue'

import { ProTableCol, SearchFormProps, SearchValueType } from './types'

const props = withDefaults(defineProps<SearchFormProps>(), {
  labelWidth: 'auto',
  resetType: 'initial'
})

const emit = defineEmits(['update:modelValue', 'submit', 'reset'])

const formSearchRef = ref<FormInstanceFunctions | null>(null)
const formData = computed<{
  [key: string]: any
}>({
  get() {
    return props.modelValue!
  },
  set(value) {
    // 触发父组件的更新
    emit('update:modelValue', value)
  }
})

const formContainerRef = ref(null)

const { width: formContainerWidth } = useElementSize(formContainerRef)

const showAllFormItem = ref(false)

const toggleDisplayFormItem = () => {
  showAllFormItem.value = !showAllFormItem.value
}

// 根据容器宽度计算，一列最小300px的情况下，最多可以放置多少个选项
// 根据栅格化12，计算出每列占多少格，向上取整
const formItemColSpan = computed(() => {
  const count = Math.floor(formContainerWidth.value / 300)
  return Math.ceil(12 / count)
})

// 根据每列占的格数，反向推出一行可放置的选项数量
const colsCount = computed(() => {
  return 12 / formItemColSpan.value
})

// 计算操作栏偏移量
// 未展开的情况下，选项数量小于可放置数量，操作栏偏移量为数量差，否则为0
const operationSpanOffset = computed(() => {
  if (showAllFormItem.value === false) {
    return formItemColSpan.value * (colsCount.value - formItemCols.value.length - 1)
  }
  return (
    (colsCount.value - (formItemCols.value.length % colsCount.value) - 1) * formItemColSpan.value
  )
})

watchEffect(() => {
  if (showAllFormItem.value && colsCount.value - 1 >= formItemCols.value.length) {
    showAllFormItem.value = false
  }
})

const formItemCols = computed(() => {
  return props.formItems
    ? props.formItems
        .filter((_, index) => showAllFormItem.value === true || index < colsCount.value - 1)
        .map((item) => {
          let valueType: SearchValueType | VNode = 't-input'
          const fieldProps: { [key: string]: any } = {
            clearable: true,
            placeholder: getPlaceholder(item)
          }
          if (typeof item.search === 'object') {
            Object.assign(fieldProps, item.search.fieldProps || {})
            if (item.search.render) {
              valueType = item.search.render()
            } else {
              valueType = item.search.valueType || 't-input'
              if (item.search.valueEnum) {
                const { valueEnum } = item.search
                fieldProps.options = Object.keys(valueEnum).map((key) => {
                  return {
                    value: key,
                    label: valueEnum[key]
                  }
                })
              }
              if (valueType === 't-date-range-picker') {
                fieldProps.enableTimePicker = true
                formData.value[item.search.key || item.colKey] = []
              }
            }

            // 设置默认值
            if (fieldProps.defaultValue) {
              formData.value[item.search.key || item.colKey] = fieldProps.defaultValue
            }

            return {
              ...item.search,
              key: item.search.key || item.colKey,
              label: item.search.label || transformTitleToLabel(item.title),
              valueType,
              fieldProps
            }
          }

          return {
            key: item.colKey,
            label: transformTitleToLabel(item.title),
            valueType,
            fieldProps
          }
        })
    : []
})

const getPlaceholder = (formItem: ProTableCol): string | string[] => {
  if (typeof formItem.search !== 'object') {
    return `请输入${formItem.title}`
  }
  const fieldProps = formItem.search.fieldProps || {}
  const { placeholder } = fieldProps
  if (placeholder) {
    return placeholder
  }
  switch (formItem.search.valueType) {
    case 't-date-range-picker':
      return ['请选择开始时间', '请选择结束时间']
    case 't-date-picker':
      return `请选择日期`
    case 't-select':
      return `请选择${formItem.search.label || transformTitleToLabel(formItem.title)}`
    default:
      return `请输入${formItem.search.label || transformTitleToLabel(formItem.title)}`
  }
}

const transformTitleToLabel = (formItemTitle: ProTableCol['title']) => {
  if (typeof formItemTitle === 'string') {
    return formItemTitle
  }
  return '-'
}

const onReset = () => {
  emit('reset')
}
const onSubmit = () => {
  emit('submit')
}

const restSearchForm = (params?: FormResetParams<any>) => {
  formSearchRef.value?.reset(params)
}

defineExpose({
  restSearchForm
})
</script>

<style lang="less" scoped>
.search-form-container {
  :deep(.t-form__label) {
    padding-right: var(--td-comp-paddingLR-m);
  }
}
.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
