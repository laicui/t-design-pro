<template>
  <div>
    <TButton @click="refresh">刷新</TButton>
    <TablePro
      ref="tableRef"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :request="request"
    ></TablePro>
  </div>
</template>

<script setup lang="ts">
import { TablePro } from 't-design-pro'
import { Button as TButton } from 'tdesign-vue-next'
import { useData } from 'vitepress'
import { ref, watch } from 'vue'

import type { ProTableCol } from '@/components/Table/types'

const { isDark } = useData()

watch(
  isDark,
  (newVal) => {
    document.documentElement.setAttribute('theme-mode', newVal ? 'dark' : 'light')
  },
  {
    immediate: true
  }
)

const columns = ref<ProTableCol[]>([
  {
    title: 'Name',
    colKey: 'name',
    width: 200
  },
  {
    title: 'Age',
    colKey: 'age',
    width: 100
  },
  {
    title: 'Address',
    colKey: 'address',
    width: 300
  }
])

const data = [
  { id: 1, name: 'John Doe', age: 30, address: '123 Main St' },
  { id: 2, name: 'Jane Smith', age: 25, address: '456 Elm St' },
  { id: 3, name: 'Alice Johnson', age: 28, address: '789 Maple Ave' },
  { id: 4, name: 'Bob Brown', age: 35, address: '101 Pine Rd' }
]

const getData = (params: { name: string }) => {
  console.log('params', params)

  return new Promise<{ data: any[]; total: number }>((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        total: data.length
      })
    }, 1500)
  })
}

const loading = ref(false)
const request = async (params) => {
  try {
    loading.value = true
    const result = await getData(params)

    return {
      data: result.data,
      total: result.total
    }
  } catch {
    return null
  } finally {
    loading.value = false
  }
}

const tableRef = ref<InstanceType<typeof TablePro> | null>(null)

const refresh = () => {
  tableRef.value?.refresh()
}
</script>

<style></style>
