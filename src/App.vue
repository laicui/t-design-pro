<template>
  <div class="app-container">
    <TablePro :columns="columns" row-key="id" :data="data">
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
  </div>
</template>
<script setup lang="ts">
import type { ProTableCol } from 't-design-pro'
import { TablePro } from 't-design-pro'
import { ref } from 'vue'

const columns = ref<ProTableCol[]>([
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

const data = ref([
  { id: 1, name: 'John Doe', age: 30, address: '123 Main St' },
  { id: 2, name: 'Jane Smith', age: 25, address: '456 Elm St' },
  { id: 3, name: 'Alice Johnson', age: 28, address: '789 Maple Ave' },
  { id: 4, name: 'Bob Brown', age: 35, address: '101 Pine Rd' },
  { id: 5, name: 'Charlie White', age: 22, address: '202 Oak St' },
  { id: 6, name: 'Diana Green', age: 27, address: '303 Birch Blvd' },
  { id: 7, name: 'Ethan Blue', age: 32, address: '404 Cedar Ct' },
  { id: 8, name: 'Fiona Black', age: 29, address: '505 Spruce Dr' },
  { id: 9, name: 'George Gray', age: 31, address: '606 Willow Way' },
  { id: 10, name: 'Hannah Yellow', age: 26, address: '707 Cherry Ln' },
  { id: 11, name: 'Ian Purple', age: 34, address: '808 Ash St' },
  { id: 12, name: 'Julia Orange', age: 23, address: '909 Palm Pl' },
  { id: 13, name: 'Kevin Pink', age: 30, address: '1010 Magnolia Ave' },
  { id: 14, name: 'Laura Cyan', age: 28, address: '1111 Peach St' },
  { id: 15, name: 'Mike Red', age: 33, address: '1212 Maple St' },
  { id: 16, name: 'Nina Teal', age: 24, address: '1313 Cedar St' },
  { id: 17, name: 'Oscar Silver', age: 36, address: '1414 Oak St' },
  { id: 18, name: 'Paula Gold', age: 21, address: '1515 Pine St' },
  { id: 19, name: 'Quinn Bronze', age: 29, address: '1616 Birch St' },
  { id: 20, name: 'Rita Copper', age: 32, address: '1717 Spruce St' }
])
</script>

<style scoped lang="less">
.app-container {
  width: 100%;
  height: 600px;
}
</style>
