<template>
  <div class="dynamic-fields-container">
    <TablePro :columns="columns" :request="fetchData" row-key="id">
      <template #tableHeaderCenter>
        <div>动态字段搜索示例</div>
      </template>
    </TablePro>
  </div>
</template>

<script setup lang="ts">
import type { ProTableCol } from 't-design-pro'
import { TablePro } from 't-design-pro'
import { useData } from 'vitepress'
import { ref, watch } from 'vue'

const { isDark } = useData()

watch(
  isDark,
  (newVal) => {
    document.documentElement.setAttribute(
      'theme-mode',
      newVal ? 'dark' : 'light'
    )
  },
  {
    immediate: true
  }
)

const columns = ref<ProTableCol[]>([
  {
    title: 'ID',
    colKey: 'id',
    width: 100,
    fixed: 'left'
  },
  {
    title: '姓名',
    colKey: 'name',
    width: 150
  },
  {
    title: '手机号',
    colKey: 'phone',
    width: 150
  },
  {
    title: '邮箱',
    colKey: 'email',
    width: 200
  },
  {
    title: '状态',
    colKey: 'status',
    width: 100,
    cellContentEnum: {
      '1': '启用',
      '0': '禁用'
    }
  },
  {
    title: '创建时间',
    colKey: 'createTime',
    width: 180
  },
  {
    title: '操作',
    colKey: 'operation',
    width: 120,
    fixed: 'right'
  },
  {
    title: '综合搜索',
    colKey: 'dynamicSearch',
    search: {
      defaultFieldKey: 'phone',
      dynamicFields: [
        {
          key: 'name',
          label: '姓名',
          valueType: 't-input',
          fieldProps: {
            placeholder: '请输入姓名',
            clearable: true
          }
        },
        {
          key: 'phone',
          label: '手机号',
          valueType: 't-input',
          fieldProps: {
            placeholder: '请输入手机号',
            maxlength: 11
          }
        },
        {
          key: 'email',
          label: '邮箱',
          valueType: 't-input',
          fieldProps: {
            placeholder: '请输入邮箱'
          }
        },
        {
          key: 'status',
          label: '状态',
          valueType: 't-select',
          valueEnum: {
            '1': '启用',
            '0': '禁用'
          },
          fieldProps: {
            placeholder: '请选择状态'
          }
        }
      ]
    }
  }
])

// 模拟数据
const mockData = [
  { id: 1, name: '张三', phone: '13800138000', email: 'zhangsan@example.com', status: '1', createTime: '2024-01-15 10:30:00' },
  { id: 2, name: '李四', phone: '13900139000', email: 'lisi@example.com', status: '0', createTime: '2024-01-16 14:20:00' },
  { id: 3, name: '王五', phone: '13700137000', email: 'wangwu@example.com', status: '1', createTime: '2024-01-17 09:15:00' },
  { id: 4, name: '赵六', phone: '13600136000', email: 'zhaoliu@example.com', status: '1', createTime: '2024-01-18 16:45:00' },
  { id: 5, name: '钱七', phone: '13500135000', email: 'qianqi@example.com', status: '0', createTime: '2024-01-19 11:30:00' },
  { id: 6, name: '孙八', phone: '13400134000', email: 'sunba@example.com', status: '1', createTime: '2024-01-20 13:20:00' },
  { id: 7, name: '周九', phone: '13300133000', email: 'zhoujiu@example.com', status: '1', createTime: '2024-01-21 15:10:00' },
  { id: 8, name: '吴十', phone: '13200132000', email: 'wushi@example.com', status: '0', createTime: '2024-01-22 10:00:00' }
]

const fetchData = async (params: any) => {
  // 模拟异步请求
  await new Promise(resolve => setTimeout(resolve, 500))

  const { current, pageSize, ...searchParams } = params

  // 过滤数据
  let filteredData = [...mockData]

  // 处理动态字段搜索
  Object.keys(searchParams).forEach(key => {
    const value = searchParams[key]
    if (value) {
      const [fieldKey, subKey] = key.split('.')
      if (fieldKey === 'dynamicSearch') {
        if (subKey === 'name') {
          filteredData = filteredData.filter(item => item.name.includes(value))
        } else if (subKey === 'phone') {
          filteredData = filteredData.filter(item => item.phone.includes(value))
        } else if (subKey === 'email') {
          filteredData = filteredData.filter(item => item.email.includes(value))
        } else if (subKey === 'status') {
          filteredData = filteredData.filter(item => item.status === value)
        }
      }
    }
  })

  // 分页处理
  const start = (current - 1) * pageSize
  const end = start + pageSize
  const pageData = filteredData.slice(start, end)

  return {
    data: pageData,
    total: filteredData.length
  }
}
</script>

<style scoped>
.dynamic-fields-container {
  height: 700px;
}
</style>
