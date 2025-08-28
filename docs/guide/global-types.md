# T-Design Pro 全局组件类型支持

## 问题描述

当使用 `app.use(TDesignPro)` 全局安装组件库时，TypeScript 无法正确推导 `<TablePro>` 等组件的类型。

## 解决方案

### 方式一：按需导入（推荐）

```typescript
import { TablePro } from 't-design-pro'
// 这种方式可以获得完整的类型支持
```

### 方式二：全局类型声明配置

如果您希望使用 `app.use(TDesignPro)` 全局安装的方式，请按以下步骤配置：

1. **在项目的 `tsconfig.json` 中添加全局类型声明文件**：

```json
{
  "compilerOptions": {
    // ... 其他配置
  },
  "include": ["src/**/*", "node_modules/t-design-pro/dist/types/global.d.ts"]
}
```

2. **或者在项目根目录创建 `types/global.d.ts` 文件**：

```typescript
/// <reference types="t-design-pro/dist/types/global" />
```

然后在 `tsconfig.json` 中包含该文件：

```json
{
  "include": ["src/**/*", "types/**/*"]
}
```

## 配置完成后

配置完成后，使用全局安装的组件时就能获得正确的类型推导：

```vue
<template>
  <!-- 现在 TablePro 会有正确的类型提示 -->
  <TablePro :columns="columns" :request="loadData" @refresh="handleRefresh" />
</template>
```

## 类型自动维护

`global.d.ts` 文件会自动引用组件的实际类型定义，无需手动维护。当组件类型更新时，全局类型声明也会自动同步。
