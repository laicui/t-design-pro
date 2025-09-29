<template>
  <div class="app-container">
    <TablePro
      ref="tableProRef"
      :columns="columns"
      row-key="id"
      :request="request"
      :table-props="{
        selectedRowKeys,
        onSelectChange: selectChange
      }"
    >
      <template #tableHeaderCenter>
        <div>Center Header</div>
      </template>
      <template #tableHeaderLeft>
        <div>Left Header</div>
      </template>
      <template #tableHeaderRight>
        <div>Right Header</div>
      </template>
    </TablePro>
    <div style="margin: 20px 0">
      <t-button @click="selectFirstTwo">选中前两行</t-button>
      <t-button @click="clearSelection" style="margin-left: 8px">清空选择</t-button>
      <span style="margin-left: 16px">已选ID: {{ selectedRowKeys }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ProTableCol, ProTableRequestMethod } from 't-design-pro'
import { TablePro } from 't-design-pro'
import { ref } from 'vue'

interface UserTableRowData {
  id: number
  name: string
  age: number
  address: string
  email: string
  phone: string
}

const columns = ref<ProTableCol<UserTableRowData>[]>([
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 48,
    fixed: 'left'
  },
  {
    title: 'ID',
    colKey: 'id',
    width: 100,
    search: true,
    fixed: 'left'
  },
  {
    title: 'Name',
    colKey: 'name',
    width: 200,
    search: true
  },
  {
    title: 'Age',
    colKey: 'age',
    width: 100,
    search: true
  },
  {
    title: 'Address',
    colKey: 'address',
    width: 300,
    search: true
  },
  {
    title: 'Email',
    colKey: 'email',
    width: 200,
    search: true
  },
  {
    title: 'Phone',
    colKey: 'phone',
    width: 150,
    search: true
  },
  {
    title: 'Actions',
    colKey: 'operation',
    width: 150,
    fixed: 'right'
  }
])

const request: ProTableRequestMethod = async (params) => {
  console.log(params)

  return {
    data: data.value,
    total: data.value.length
  }
}
const data = ref([
  {
    id: 1,
    name: 'John Doe',
    age: 30,
    address: '123 Main St',
    email: 'john@example.com',
    phone: '123-456-7890'
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 25,
    address: '456 Elm St',
    email: 'jane@example.com',
    phone: '234-567-8901'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    age: 28,
    address: '789 Maple Ave',
    email: 'alice@example.com',
    phone: '345-678-9012'
  },
  {
    id: 4,
    name: 'Bob Brown',
    age: 35,
    address: '101 Pine Rd',
    email: 'bob@example.com',
    phone: '456-789-0123'
  },
  {
    id: 5,
    name: 'Charlie White',
    age: 22,
    address: '202 Oak St',
    email: 'charlie@example.com',
    phone: '567-890-1234'
  },
  {
    id: 6,
    name: 'Diana Green',
    age: 27,
    address: '303 Birch Blvd',
    email: 'diana@example.com',
    phone: '678-901-2345'
  },
  {
    id: 7,
    name: 'Ethan Blue',
    age: 32,
    address: '404 Cedar Ct',
    email: 'ethan@example.com',
    phone: '789-012-3456'
  },
  {
    id: 8,
    name: 'Fiona Black',
    age: 29,
    address: '505 Spruce Dr',
    email: 'fiona@example.com',
    phone: '890-123-4567'
  },
  {
    id: 9,
    name: 'George Gray',
    age: 31,
    address: '606 Willow Way',
    email: 'george@example.com',
    phone: '901-234-5678'
  },
  {
    id: 10,
    name: 'Hannah Yellow',
    age: 26,
    address: '707 Cherry Ln',
    email: 'hannah@example.com',
    phone: '012-345-6789'
  },
  {
    id: 11,
    name: 'Ian Purple',
    age: 34,
    address: '808 Ash St',
    email: 'ian@example.com',
    phone: '123-456-7890'
  },
  {
    id: 12,
    name: 'Julia Orange',
    age: 23,
    address: '909 Palm Pl',
    email: 'julia@example.com',
    phone: '234-567-8901'
  },
  {
    id: 13,
    name: 'Kevin Pink',
    age: 30,
    address: '1010 Magnolia Ave',
    email: 'kevin@example.com',
    phone: '345-678-9012'
  },
  {
    id: 14,
    name: 'Laura Cyan',
    age: 28,
    address: '1111 Peach St',
    email: 'laura@example.com',
    phone: '456-789-0123'
  },
  {
    id: 15,
    name: 'Mike Red',
    age: 33,
    address: '1212 Maple St',
    email: 'mike@example.com',
    phone: '567-890-1234'
  },
  {
    id: 16,
    name: 'Nina Teal',
    age: 24,
    address: '1313 Cedar St',
    email: 'nina@example.com',
    phone: '678-901-2345'
  },
  {
    id: 17,
    name: 'Oscar Silver',
    age: 36,
    address: '1414 Oak St',
    email: 'oscar@example.com',
    phone: '789-012-3456'
  },
  {
    id: 18,
    name: 'Paula Gold',
    age: 21,
    address: '1515 Pine St',
    email: 'paula@example.com',
    phone: '890-123-4567'
  },
  {
    id: 19,
    name: 'Quinn Bronze',
    age: 29,
    address: '1616 Birch St',
    email: 'quinn@example.com',
    phone: '901-234-5678'
  },
  {
    id: 20,
    name: 'Rita Copper',
    age: 32,
    address: '1717 Spruce St',
    email: 'rita@example.com',
    phone: '012-345-6789'
  }
])

const selectedRowKeys = ref<Array<number>>([4, 5])
const selectFirstTwo = () => {
  selectedRowKeys.value = [1, 2]
}
const clearSelection = () => {
  selectedRowKeys.value = []
}

const selectChange = (keys, options) => {
  console.log(keys)
  console.log(options)
  selectedRowKeys.value = keys
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
