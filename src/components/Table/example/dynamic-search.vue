<template>
  <div class="app-container">
    <TablePro row-key="id" :columns="columns" :request="request" />
  </div>
</template>

<script setup lang="ts">
import type { ProTableCol, ProTableRequestMethod } from 't-design-pro'
import { TablePro } from 't-design-pro'
import { ref } from 'vue'

interface UserTableRowData {
  id: number
  name: string
  phone: string
  email: string
  status: string
}

const columns = ref<ProTableCol<UserTableRowData>[]>([
  {
    colKey: 'name',
    title: '姓名',
    width: 150,
    search: {
      dynamicFields: [
        { key: 'name', label: '姓名' },
        { key: 'phone', label: '手机号' },
        { key: 'email', label: '邮箱' },
        {
          key: 'status',
          label: '状态',
          valueType: 't-select',
          valueEnum: { '1': '启用', '0': '禁用' }
        }
      ]
    }
  },
  {
    colKey: 'phone',
    title: '手机号',
    width: 150,
    search: true
  },
  {
    colKey: 'email',
    title: '邮箱',
    width: 200
  },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    cellContentEnum: { '1': '启用', '0': '禁用' }
  }
])

const data = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    status: '1'
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    email: 'lisi@example.com',
    status: '0'
  },
  {
    id: 3,
    name: '王五',
    phone: '13700137000',
    email: 'wangwu@example.com',
    status: '1'
  },
  {
    id: 4,
    name: '赵六',
    phone: '13600136000',
    email: 'zhaoliu@example.com',
    status: '1'
  },
  {
    id: 5,
    name: '孙七',
    phone: '13500135000',
    email: 'sunqi@example.com',
    status: '0'
  }
])

const request: ProTableRequestMethod = async (params) => {
  console.log('搜索参数:', params)

  // 根据搜索参数过滤
  // params 已经是扁平结构，直接使用即可
  // 例如：{ name: '张三' } 或 { phone: '13800138000' }
  let filteredData = [...data.value]

  if (params.name) {
    filteredData = filteredData.filter((item) =>
      item.name.includes(params.name)
    )
  }
  if (params.phone) {
    filteredData = filteredData.filter((item) =>
      item.phone.includes(params.phone)
    )
  }
  if (params.email) {
    filteredData = filteredData.filter((item) =>
      item.email.includes(params.email)
    )
  }
  if (params.status) {
    filteredData = filteredData.filter((item) => item.status === params.status)
  }

  return {
    data: filteredData,
    total: filteredData.length
  }
}
</script>

<style scoped lang="less">
.app-container {
  width: 100%;
  height: 600px;
  background-color: #fff;
  padding: 16px;
}
</style>
