---
next: false
---

<script setup>
import BaseSwitch from './base.vue'
import AsyncSwitch from './async.vue'
import CustomValueSwitch from './custom-value.vue'
import DemoPreview from '../DemoPreview.vue'
</script>

# SwitchPro 开关组件

基于 TDesign Vue Next Switch 组件的增强版本，提供异步请求、自定义值等高级功能。

## 功能特性

- ⚡ **异步操作** - 支持异步请求，自动处理加载状态
- 🔄 **请求拦截** - 内置 beforeChange 钩子，支持请求前验证
- 🎯 **自定义值** - 支持自定义开关的真假值
- 🔒 **状态控制** - 请求失败时自动回滚状态
- 💡 **类型安全** - 完整的 TypeScript 类型支持
- 🎨 **无缝集成** - 完全兼容 TDesign Switch 的所有属性

## 基础使用

最简单的开关组件使用方式。

::: raw
<BaseSwitch />
:::

::: details 查看代码
<<< ./base.vue
:::

## 异步请求

支持异步操作的开关，适用于需要调用接口确认的场景。

::: raw
<AsyncSwitch />
:::

::: details 查看代码
<<< ./async.vue
:::

## 自定义值

支持自定义开关的值，如使用数字 `1/0` 或字符串 `'on'/'off'` 等。

::: raw
<CustomValueSwitch />
:::

::: details 查看代码
<<< ./custom-value.vue
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 开关值，支持 v-model | `SwitchValue` | - |
| customValue | 自定义开关值 `[打开时的值, 关闭时的值]` | `[SwitchValue, SwitchValue]` | `[true, false]` |
| request | 异步请求函数，返回 Promise | `() => Promise<boolean>` | - |
| ...其他属性 | 支持 TDesign Switch 的所有原生属性 | - | - |

### 类型定义

```typescript
// SwitchValue 类型（来自 TDesign）
type SwitchValue = string | number | boolean

// SwitchPro 组件属性
interface SwitchProProps {
  modelValue?: SwitchValue
  customValue?: [SwitchValue, SwitchValue]
  request?: () => Promise<boolean>
}
```

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| change | 开关状态改变时触发 | `(value: SwitchValue)` |
| update:modelValue | 用于 v-model 双向绑定 | `(value: SwitchValue)` |

## 使用场景

### 1. 状态切换需要后端确认

```vue
<template>
  <SwitchPro
    v-model="enabled"
    :request="toggleStatus"
  />
</template>

<script setup>
import { ref } from 'vue'
import { SwitchPro } from 't-design-pro'

const enabled = ref(false)

const toggleStatus = async () => {
  try {
    const res = await api.updateStatus(!enabled.value)
    return res.success // 返回 true 表示允许切换
  } catch (error) {
    console.error('状态切换失败', error)
    return false // 返回 false 阻止切换
  }
}
</script>
```

### 2. 使用数字作为开关值

```vue
<template>
  <SwitchPro
    v-model="status"
    :custom-value="[1, 0]"
  />
</template>

<script setup>
import { ref } from 'vue'
import { SwitchPro } from 't-design-pro'

const status = ref(0) // 0: 关闭, 1: 打开
</script>
```

### 3. 带确认提示的开关

```vue
<template>
  <SwitchPro
    v-model="deleteMode"
    :request="confirmDelete"
  />
</template>

<script setup>
import { ref } from 'vue'
import { SwitchPro } from 't-design-pro'
import { MessagePlugin } from 'tdesign-vue-next'

const deleteMode = ref(false)

const confirmDelete = async () => {
  if (!deleteMode.value) {
    // 开启删除模式时需要确认
    const result = await MessagePlugin.confirm('确定要开启删除模式吗？')
    return result === 'confirm'
  }
  return true // 关闭删除模式无需确认
}
</script>
```

## 注意事项

1. **异步请求处理**：当配置了 `request` 属性时，组件会自动显示加载状态，并在请求完成后更新状态。

2. **请求失败回滚**：如果 `request` 函数返回 `false` 或抛出异常，开关状态会自动回滚到切换前的状态。

3. **自定义值类型**：使用 `customValue` 时，确保绑定的值类型与配置的自定义值类型一致。

4. **原生属性透传**：SwitchPro 组件会自动透传所有 TDesign Switch 支持的属性，如 `size`、`label`、`disabled` 等。

## 与 TDesign Switch 的区别

| 特性 | TDesign Switch | SwitchPro |
|------|---------------|-----------|
| 基础开关功能 | ✅ | ✅ |
| 异步请求支持 | ❌ | ✅ |
| 自动加载状态 | ❌ | ✅ |
| 请求失败回滚 | ❌ | ✅ |
| beforeChange 简化 | 需手动实现 | 内置支持 |