---
next: false
---

<script setup>
import BaseTable from './base.vue'
import RequestTable from './request.vue'
</script>

# TablePro 表格组件

基于 TDesign Vue Next 的增强表格组件，提供搜索表单、分页、排序、过滤等高级功能。

## 功能特性

- 🔍 **智能搜索表单** - 自动根据列配置生成搜索表单
- 📄 **分页支持** - 内置分页功能，支持前端和后端分页
- 🔄 **数据请求** - 支持异步数据请求和自动加载状态
- 📊 **排序过滤** - 支持列排序和数据过滤
- 🎨 **插槽扩展** - 丰富的插槽支持，灵活定制表格头部和内容
- 🔧 **类型安全** - 完整的 TypeScript 类型定义
- 📱 **响应式布局** - 搜索表单自适应容器宽度

## 基础使用

::: raw
<BaseTable />
:::

::: details 查看代码
<<< ./base.vue
:::

## 动态请求数据

::: raw
<RequestTable />
:::

::: details 查看代码
<<< ./request.vue
:::

## API

### Props

| 参数             | 说明                        | 类型                      | 默认值                                       |
| ---------------- | --------------------------- | ------------------------- | -------------------------------------------- |
| request          | 数据请求方法                | `ProTableRequestMethod`   | -                                            |
| extendParams     | 请求扩展参数                | `ExtendParams`            | -                                            |
| columns          | 表格列配置                  | `ProTableCol[]`           | `[]`                                         |
| data             | 静态数据                    | `Array<any>`              | -                                            |
| rowKey           | 行数据的唯一标识字段名      | `string`                  | `'id'`                                       |
| cellEmptyContent | 空单元格显示内容            | `string`                  | `'-'`                                        |
| pagination       | 分页配置                    | `PaginationProps \| null` | `{ defaultCurrent: 1, defaultPageSize: 50 }` |
| resetType        | 表单重置类型                | `'initial' \| 'empty'`    | `'initial'`                                  |
| tableProps       | 透传给 EnhancedTable 的属性 | `ProTablePropsOmitKey`    | `{}`                                         |

### ProTableCol 列配置

| 参数            | 说明               | 类型                               | 默认值  |
| --------------- | ------------------ | ---------------------------------- | ------- |
| colKey          | 列标识符           | `string`                           | -       |
| title           | 列标题             | `string \| TNode`                  | -       |
| width           | 列宽度             | `number \| string`                 | -       |
| fixed           | 固定列位置         | `'left' \| 'right'`                | -       |
| hidden          | 是否隐藏列         | `boolean`                          | `false` |
| search          | 搜索配置           | `ProTableColSearchType \| boolean` | -       |
| cellContentEnum | 单元格内容枚举映射 | `Record<string, any>`              | -       |
| cell            | 自定义单元格渲染   | `TNode`                            | -       |

### ProTableColSearchType 搜索配置

| 参数       | 说明                          | 类型                  | 默认值      |
| ---------- | ----------------------------- | --------------------- | ----------- |
| key        | 搜索字段名（默认使用 colKey） | `string`              | -           |
| label      | 搜索表单标签                  | `string`              | -           |
| valueType  | 搜索组件类型                  | `SearchValueType`     | `'t-input'` |
| valueEnum  | 选择器选项枚举                | `Record<string, any>` | -           |
| fieldProps | 组件属性                      | `Record<string, any>` | -           |
| render     | 自定义渲染搜索组件            | `() => VNode`         | -           |

### SearchValueType 搜索组件类型

支持的搜索组件类型：

- `'t-input'` - 输入框
- `'t-select'` - 选择器
- `'t-date-picker'` - 日期选择器
- `'t-date-range-picker'` - 日期范围选择器
- `VNode` - 自定义组件

### 方法

| 方法名         | 说明                         | 参数                          | 返回值 |
| -------------- | ---------------------------- | ----------------------------- | ------ |
| refresh        | 刷新表格数据（不重置分页）   | -                             | -      |
| reset          | 重置表格（重置分页到第一页） | -                             | -      |
| restSearchForm | 重置搜索表单                 | `FormResetParams`             | -      |
| appendTo       | 新增数据到指定位置           | `(key: string, newData: any)` | -      |

### 插槽

| 插槽名            | 说明             | 参数 |
| ----------------- | ---------------- | ---- |
| tableHeaderCenter | 表格头部中心区域 | -    |
| tableHeaderLeft   | 表格头部左侧区域 | -    |
| tableHeaderRight  | 表格头部右侧区域 | -    |
| empty             | 空数据状态       | -    |

### 事件

继承 TDesign EnhancedTable 的所有事件，主要包括：

- `change` - 分页、排序、过滤变化时触发
- `select-change` - 选择变化时触发
- `expand-change` - 展开变化时触发

## 高级用法

### 搜索表单配置

```vue
<template>
  <TablePro :columns="columns" :request="fetchData" />
</template>

<script setup>
const columns = [
  {
    title: '用户名',
    colKey: 'username',
    search: true // 简单搜索配置
  },
  {
    title: '状态',
    colKey: 'status',
    search: {
      valueType: 't-select',
      valueEnum: {
        active: '活跃',
        inactive: '非活跃'
      }
    }
  },
  {
    title: '创建时间',
    colKey: 'createTime',
    search: {
      valueType: 't-date-range-picker',
      fieldProps: {
        enableTimePicker: true
      }
    }
  }
]
</script>
```

### 自定义搜索组件

```vue
<script setup>
const columns = [
  {
    title: '自定义搜索',
    colKey: 'custom',
    search: {
      render: () =>
        h(CustomComponent, {
          placeholder: '请输入关键词'
        })
    }
  }
]
</script>
```

### 数据请求方法

```javascript
const fetchData = async (params) => {
  const { current, pageSize, ...searchParams } = params

  const response = await api.getTableData({
    page: current,
    size: pageSize,
    ...searchParams
  })

  return {
    data: response.list,
    total: response.total
  }
}
```

### 表格头部插槽

```vue
<template>
  <TablePro :columns="columns">
    <template #tableHeaderLeft>
      <t-button theme="primary">新增</t-button>
    </template>
    <template #tableHeaderRight>
      <t-button theme="default">导出</t-button>
      <t-button theme="default">设置</t-button>
    </template>
  </TablePro>
</template>
```

## 注意事项

1. **数据请求方法**：`request` 方法需要返回 `{ data: Array, total: number }` 格式的数据
2. **列标识符**：每列必须设置唯一的 `colKey`
3. **搜索表单**：只有设置了 `search` 属性的列才会出现在搜索表单中
4. **分页处理**：组件会自动处理分页参数传递和页码管理
5. **响应式布局**：搜索表单会根据容器宽度自动调整列数和布局
