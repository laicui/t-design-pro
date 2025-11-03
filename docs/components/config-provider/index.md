---
next: false
---

<script setup>
import AppExample from './app.vue'
</script>

# ConfigProvider 全局配置

用于全局配置 t-design-pro 组件的国际化语言设置。

## 功能特性

- 🌍 **国际化支持** - 提供全局语言配置能力
- 🔄 **动态切换** - 支持运行时动态切换语言
- 🎯 **依赖注入** - 使用 Vue 的 provide/inject 机制传递配置
- 💡 **类型安全** - 完整的 TypeScript 类型支持
- 🚀 **轻量简洁** - 核心实现简单高效

## 基础使用

最简单的全局配置使用方式，动态切换语言环境。
在应用根组件中使用 ConfigProvider 包裹整个应用，实现全局国际化。
::: raw
<AppExample />

:::

::: details 查看代码
<<< ./app.vue
:::

## API

### Props

| 参数   | 说明       | 类型     | 默认值    |
| ------ | ---------- | -------- | --------- |
| locale | 语言环境码 | `string` | `'zh-CN'` |

### 类型定义

```typescript
interface IConfigProviderProps {
  locale?: string
}
```

## 使用场景

### 1. 全局应用配置

在应用入口文件（如 `App.vue`）中使用：

```vue
<template>
  <ConfigProviderPro :locale="currentLocale">
    <RouterView />
  </ConfigProviderPro>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ConfigProviderPro } from 't-design-pro'

const currentLocale = ref('zh-CN')
</script>
```

### 2. 配合本地存储

结合 `localStorage` 或 `@vueuse/core` 的 `useLocalStorage` 持久化用户的语言选择：

```vue
<template>
  <ConfigProviderPro :locale="locale">
    <RouterView />
  </ConfigProviderPro>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { ConfigProviderPro } from 't-design-pro'

// 语言设置会自动保存到 localStorage
const locale = useLocalStorage('app-locale', 'zh-CN')
</script>
```

### 3. 响应式语言切换

配合下拉菜单或按钮实现语言切换：

```vue
<template>
  <ConfigProviderPro :locale="currentLocale">
    <t-dropdown :options="langOptions" @click="handleLangChange">
      <t-button>
        {{ currentLangLabel }}
        <template #suffix>
          <t-icon name="chevron-down" />
        </template>
      </t-button>
    </t-dropdown>

    <!-- 应用内容 -->
    <div class="app-content">
      <router-view />
    </div>
  </ConfigProviderPro>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ConfigProviderPro } from 't-design-pro'

const currentLocale = ref('zh-CN')

const langOptions = [
  { content: '简体中文', value: 'zh-CN' },
  { content: '繁體中文', value: 'zh-TW' },
  { content: 'English', value: 'en-US' }
]

const currentLangLabel = computed(() => {
  return langOptions.find((opt) => opt.value === currentLocale.value)?.content
})

const handleLangChange = (data: any) => {
  currentLocale.value = data.value
}
</script>
```

### 4. 配合国际化 Hook

结合 `useLocalLang` Hook 使用翻译功能：

```vue
<template>
  <ConfigProviderPro :locale="currentLocale">
    <div>
      <h1>{{ t('common.lang') }}</h1>
      <t-button>{{ t('common.button.search') }}</t-button>
      <t-button>{{ t('common.button.reset') }}</t-button>
    </div>
  </ConfigProviderPro>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ConfigProviderPro } from 't-design-pro'
import { useLocalLang } from '@/locales'

const currentLocale = ref('zh-CN')
const { t } = useLocalLang()
</script>
```

## 国际化配置

### 语言文件结构

项目中的语言文件存放在 `src/locales/langs/` 目录下：

```
src/locales/langs/
├── zh-CN/
│   ├── common.json      # 公共翻译
│   └── components.json  # 组件翻译
├── zh-TW/
│   ├── common.json
│   └── components.json
└── en-US/
    ├── common.json
    └── components.json
```

### 语言文件示例

**zh-CN/common.json**

```json
{
  "lang": "简体中文",
  "button": {
    "search": "搜索",
    "reset": "重置"
  },
  "input": {
    "tips": "请输入"
  },
  "select": {
    "tips": "请选择"
  }
}
```

**zh-TW/common.json**

```json
{
  "lang": "繁體中文",
  "button": {
    "search": "搜尋",
    "reset": "重置"
  },
  "input": {
    "tips": "請輸入"
  },
  "select": {
    "tips": "請選擇"
  }
}
```

### 使用翻译

```typescript
import { useLocalLang } from '@/locales'

const { t } = useLocalLang()

// 使用翻译
const searchText = t('common.button.search') // "搜索" 或 "搜尋"
const langName = t('common.lang') // "简体中文" 或 "繁體中文"
```

## 工作原理

ConfigProvider 通过 Vue 的 `provide/inject` 机制实现配置的跨组件传递：

```typescript
// ConfigProvider 内部实现（简化版）
import { provide, toRef } from 'vue'

const props = defineProps<{ locale?: string }>()
const locale = toRef(props, 'locale')

// 提供给子组件
provide('lai-locale', locale)
```

子组件或 Hook 中获取配置：

```typescript
import { inject } from 'vue'

// 在组件或 composable 中注入
const locale = inject<Ref<string>>('lai-locale')
```

## 注意事项

1. **位置要求**：ConfigProvider 需要包裹在需要国际化的组件外层，通常放在应用的根组件中。

2. **嵌套覆盖**：当存在多层 ConfigProvider 时，内层的配置会覆盖外层的配置。

3. **响应式更新**：locale 属性变化时，所有使用 `useLocalLang()` 的组件会自动响应更新。

4. **语言代码**：locale 值应该与 `src/locales/langs/` 目录下的文件夹名称对应。

5. **默认值**：如果不提供 locale 属性，默认使用 `'zh-CN'`。

6. **类型安全**：建议配合 TypeScript 使用，可以获得完整的类型提示和检查。

## 与其他组件的集成

ConfigProvider 是 t-design-pro 组件库的基础设施组件，其他组件（如 TablePro、SwitchPro 等）都可以通过 `useLocalLang()` Hook 获取当前的语言配置。

```vue
<!-- TablePro 会自动使用 ConfigProvider 提供的语言配置 -->
<ConfigProviderPro locale="zh-CN">
  <TablePro :columns="columns" :data="data" />
</ConfigProviderPro>
```

## 最佳实践

1. **单一入口配置**：在应用根组件中配置一次，避免多处配置导致混乱。

2. **持久化存储**：将用户的语言选择保存到 localStorage，提升用户体验。

3. **浏览器语言检测**：可以根据浏览器语言自动设置默认语言：

```typescript
import { usePreferredLanguages } from '@vueuse/core'

const languages = usePreferredLanguages()
const defaultLocale = languages.value[0] || 'zh-CN'
```

4. **类型定义**：为语言文件创建类型定义，提高开发效率：

```typescript
// types/i18n.ts
export interface CommonLang {
  lang: string
  button: {
    search: string
    reset: string
  }
  // ...
}
```

5. **翻译键管理**：使用常量或枚举管理翻译键，避免硬编码：

```typescript
export const I18N_KEYS = {
  COMMON: {
    LANG: 'common.lang',
    BUTTON_SEARCH: 'common.button.search',
    BUTTON_RESET: 'common.button.reset'
  }
} as const

// 使用
const searchText = t(I18N_KEYS.COMMON.BUTTON_SEARCH)
```

## 相关资源

- [Vue Provide/Inject](https://vuejs.org/guide/components/provide-inject.html) - Vue 官方文档
