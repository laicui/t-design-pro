<template>
  <div class="pro-table-wrapper">
    <!-- 表格顶部搜索表单card -->
    <t-card v-if="renderSearchForm" ref="formCardRef" class="form-card" :bordered="false">
      <search-form
        ref="searchFormRef"
        v-model="searchFormData"
        :form-items="searchFormItems"
        :reset-type="resetType"
        @submit="reset"
        @reset="reset"
      />
    </t-card>
    <!-- 表格主题card -->
    <t-card class="table-card" :bordered="false">
      <!-- 表格头部扩展插槽 -->
      <div
        v-if="slots.tableHeaderCenter || slots.tableHeaderLeft || slots.tableHeaderRight"
        ref="tableHeaderRowRef"
      >
        <t-row class="table-header-row">
          <t-col :span="12">
            <slot name="tableHeaderCenter"></slot>
          </t-col>
        </t-row>
        <t-row class="table-header-row" justify="space-between" align="center">
          <t-col flex="auto" class="table-header-left">
            <slot name="tableHeaderLeft"></slot>
          </t-col>
          <t-col flex="auto" class="table-header-right">
            <slot name="tableHeaderRight"></slot>
          </t-col>
        </t-row>
      </div>
      <!-- 表格主题 -->
      <t-enhanced-table
        ref="tableRef"
        class="table-default"
        v-bind="{ ...props, ...props.tableProps }"
        :loading="loading"
        :data="dataSource"
        :columns="formatColumns"
        :pagination="paginationComputed"
        @change="onChange"
      >
        <template v-if="slots.empty" #empty>
          <slot name="empty"></slot>
        </template>
      </t-enhanced-table>
    </t-card>
  </div>
</template>
<script setup lang="ts">
import {
  Card as TCard,
  Col as TCol,
  EnhancedTable as TEnhancedTable,
  EnhancedTableInstanceFunctions,
  FormResetParams,
  Row as TRow,
  TableChangeContext,
  TableChangeData,
  TableInstanceFunctions
} from 'tdesign-vue-next'
import { computed, nextTick, onMounted, reactive, ref, toRaw, useSlots, watch } from 'vue'

import searchForm from './searchForm.vue'
import type { ProTableProps, ProTablePropsOmitKey } from './types.ts'
import { getInitSearchFormData } from './utils.ts'

// =====================================================================================
// 初始化相关
defineOptions({
  inheritAttrs: false,
  name: 'TablePro'
})

const slots = useSlots()

const props = withDefaults(defineProps<ProTableProps>(), {
  rowKey: 'id',
  cellEmptyContent: '-',
  disableDataPage: true,
  hover: true,
  height: '100%',
  showSortColumnBgColor: true,
  pagination: () => ({
    defaultCurrent: 1,
    defaultPageSize: 50,
    pageSizeOptions: [10, 20, 50, 100]
  }),
  columns: () => [],
  tableProps: () => {
    return {} as ProTablePropsOmitKey
  }
})

const paginationReactive = reactive({
  current: 1,
  pageSize: 50,
  total: 0
})

const resetPagination = () => {
  paginationReactive.current = 1
  paginationReactive.total = 0
}

const paginationComputed = computed(() => {
  if (props.pagination === null) return undefined
  return {
    ...paginationReactive,
    ...props.pagination
  }
})

// =======================================================================================
// 处理搜索表单相关

const searchFormData = ref<{ [key: string]: any }>({})
const searchFormRef = ref<InstanceType<typeof searchForm> | null>(null)

const searchFormItems = computed(() => {
  return props.columns.filter(
    (item) =>
      item.colKey &&
      item.colKey !== 'drag' &&
      item.colKey !== 'operations' &&
      item.colKey !== 'row-select' &&
      item.search
  )
})

const renderSearchForm = computed(() => searchFormItems.value.length > 0)

// =======================================================================================
// 处理表格相关

const dataSource = ref(props.data || [])

watch(
  () => props.data,
  (newData) => {
    dataSource.value = newData || []
  },
  { deep: true }
)

// 过滤隐藏列
const formatColumns = computed(() => {
  return props.columns
    .filter((item) => item.hidden !== true)
    .map((item) => {
      // 判断是否有枚举值，并且没有自定义渲染的情况下，默认渲染枚举值
      if (!item.cell && item.cellContentEnum) {
        return {
          ...item,
          cell: (_h, { col, row }) => {
            if (item.cellContentEnum) {
              return item.cellContentEnum[row[col.colKey]] || props.cellEmptyContent
            }
          }
        }
      }
      return item
    })
})

const loading = ref(false)

// 处理扩展请求参数
watch(
  () => props.extendParams,
  (newValue) => {
    request(newValue)
  },
  {
    deep: true
  }
)

const request = async (params?: { [key: string]: any }) => {
  if (!props.request) return
  dataSource.value = []
  try {
    loading.value = true

    const requestParams: {
      [key: string]: any
    } = {
      ...props.sort,
      ...props.extendParams,
      ...toRaw(searchFormData.value),
      ...params
    }

    if (props.pagination !== null) {
      const { current, pageSize } = paginationComputed.value || {}
      requestParams.current = current
      requestParams.pageSize = pageSize
    }

    const result = await props.request?.(requestParams)
    paginationReactive.total = result?.total || 0
    dataSource.value = result?.data || []

    /**
     * 这里是为了防止删除数据后导致页面当前页面数据长度为 0 的情况
     * 当删除数据后，会把当前页面的 currentPage 重置为 1
     * 但是这个时候当前页面的数据长度为 0，就会进入这个判断
     * 如果不处理，那么会导致当前页面会显示没有数据
     */
    if (dataSource.value.length === 0 && paginationReactive.current > 1) {
      paginationReactive.current--
      request(params)
    }
  } catch (error: any) {
    console.error('请求列表错误：', error.message)
  } finally {
    loading.value = false
  }
}

// 分页、排序、过滤等发生变化时会触发 change 事件
const onChange = (changeParams: TableChangeData, { trigger }: TableChangeContext<any>) => {
  console.log('分页、排序、过滤等发生变化时会触发 change 事件：', changeParams, trigger)
  switch (trigger) {
    case 'filter':
    case 'sorter':
      request(changeParams[trigger])
      break
    case 'pagination':
      paginationReactive.current = changeParams.pagination?.current || 1
      paginationReactive.pageSize = changeParams.pagination?.pageSize || 10

      nextTick(() => {
        request()
      })
      break
    default:
      break
  }
}

onMounted(async () => {
  await nextTick()
  if (renderSearchForm.value) {
    // 获取初始搜索表单数据
    const initSearchFormData = getInitSearchFormData(toRaw(searchFormItems.value))
    searchFormData.value = initSearchFormData
    request(initSearchFormData)
    return
  }

  request()
})

const tableRef = ref<(TableInstanceFunctions & EnhancedTableInstanceFunctions) | null>(null)
const refresh = () => {
  // 刷新表格，不重置分页页码
  request()
}
const reset = () => {
  // 重置表格，重置分页页码
  resetPagination()
  nextTick(() => {
    request()
  })
}

const restSearchForm = (params?: FormResetParams<any>) => {
  searchFormRef.value?.restSearchForm(params)
}

const appendTo: EnhancedTableInstanceFunctions['appendTo'] = (key, newData) => {
  tableRef.value?.appendTo(key, newData)
}
defineExpose({
  refresh,
  reset,
  restSearchForm,
  appendTo
})
</script>

<style lang="less" scoped>
.pro-table-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  & :deep(.t-table__header) {
    & > tr > th {
      background-color: var(--td-bg-color-secondarycontainer);
    }
  }

  .table-card {
    flex: 1;
    height: 1%;

    :deep(.t-card__body) {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .table-default {
    flex: 1;
    height: 1%;
    display: flex;
    flex-direction: column;

    :deep(.t-table__content) {
      flex: 1;
    }
  }
}
.table-header-row {
  padding-bottom: 16px;

  .table-header-left {
    display: flex;
  }
  .table-header-right {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
