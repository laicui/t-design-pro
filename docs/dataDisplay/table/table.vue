<template>
  <div>
    <TablePro :columns="columns" row-key="id" :request="request"></TablePro>
  </div>
</template>

<script setup lang="ts">
import { TablePro } from 't-design-pro'
import { ref } from 'vue'

import { ProTableCol } from '@/components/Table/types'

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

const data = ref([
  { id: 1, name: 'John Doe', age: 30, address: '123 Main St' },
  { id: 2, name: 'Jane Smith', age: 25, address: '456 Elm St' },
  { id: 3, name: 'Alice Johnson', age: 28, address: '789 Maple Ave' },
  { id: 4, name: 'Bob Brown', age: 35, address: '101 Pine Rd' }
])
const request = async () => {
  // Simulate an API call
  return Promise.resolve({
    data: data.value,
    total: data.value.length,
    success: true
  })
}
</script>

<style></style>
