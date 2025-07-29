# T-Design Pro - AI 编程指南

T-Design Pro 是一个基于 TDesign Vue Next 构建的 Vue 3 高阶组件库。这是一个包含组件库源码和 VitePress 文档的 monorepo 项目。

## 架构概览

### 组件自动注册模式
组件库使用 Vite 的 `import.meta.glob` 实现组件的自动发现和注册：
```typescript
// src/index.ts - 自动发现所有 components/**/index.vue 文件
const modules = (import.meta as any).glob('./components/**/index.vue', { eager: true })
```
每个组件必须在 `defineOptions()` 中设置 `name` 属性以实现正确注册。如果没有提供名称，默认为 `{文件夹名称}Pro`。

### 组件结构
所有组件都应遵循以下一致的模式：
```
src/components/{ComponentName}/
├── index.vue        # 主组件，包含 defineOptions({ name: 'ComponentPro' })
├── types.ts         # 扩展 TDesign 基础类型的 TypeScript 接口
├── utils.ts         # 辅助函数（可选）
└── searchForm.vue   # 子组件（如需要）
```

### TypeScript 集成
- 所有组件都使用 TypeScript 的 `Pick` 和 `Omit` 工具扩展 TDesign 的基础接口
- 使用 `ProTableProps` 模式：扩展基础属性，添加自定义属性，省略冲突属性
- 从组件的 `types.ts` 导出类型供外部使用

## 开发工作流程

### 构建命令
```bash
pnpm dev              # 组件测试的开发服务器
pnpm build            # 构建组件库（ES、CJS、UMD 格式）
pnpm docs:dev         # VitePress 文档开发模式
pnpm docs:build       # 构建用于 GitHub Pages 的文档
```

### 组件库构建配置
- 入口：`src/index.ts`
- 输出：ES 模块、CommonJS、UMD 格式
- 外部依赖：`vue`、`tdesign-vue-next`（peer dependencies）
- CSS：打包为单个样式表 `dist/styles/index.css`

### 文档结构模式
VitePress 文档遵循以下结构：
- `docs/index.md` - 主页，包含英雄区块
- `docs/{category}/{component}/index.md` - 组件文档
- `docs/{category}/{component}/{component}.vue` - 实时示例
- 直接导入组件：`import { TablePro } from 't-design-pro'`

## 核心约定

### 组件属性模式
```typescript
// 有选择性地扩展 TDesign 接口
interface ProTableProps<T extends TableRowData = TableRowData>
  extends Pick<EnhancedTableProps<T>, PickPrimaryTableProps>,
    Pick<FormProps, 'resetType'> {
  request?: ProTableRequestMethod
  columns: ProTableCol[]
  // 在这里添加自定义属性
}
```

### 搜索表单集成
TablePro 展示了搜索模式：
- 带有 `search` 属性的列会自动生成表单字段
- 支持 `t-input`、`t-select`、`t-date-picker`、`t-date-range-picker`
- 通过 `v-model` 和响应式更新实现表单数据同步

### 样式约定
- 使用 TDesign CSS 变量的 scoped 样式：`var(--td-bg-color-secondarycontainer)`
- 使用 Flexbox 布局实现响应式组件结构
- 使用深度选择器自定义 TDesign 组件：`:deep(.t-table__header)`

## 依赖与集成

### 前置依赖（必需）
用户在使用组件库前必须安装以下依赖：
```bash
npm install vue@^3.5.0 tdesign-vue-next@^1.14.0
```

### 导入模式
```typescript
// 完整库注册
import TDesignPro from 't-design-pro'
app.use(TDesignPro)

// 支持 Tree-shaking 的按需导入
import { TablePro } from 't-design-pro'
```

### CSS 要求
必须同时导入 TDesign 和本库的样式：
```javascript
import 'tdesign-vue-next/es/style/index.css'
import 't-design-pro/dist/styles/index.css'
```

## 测试与示例

### 组件使用模式
参考 `docs/dataDisplay/table/table.vue` 了解标准组件示例模式：
- 使用 TypeScript 接口定义列配置
- 使用 `request` 属性进行异步数据加载
- 实现适当的错误处理和加载状态

添加新组件时，确保遵循 TablePro 模式以保持一致性，并充分利用 TDesign 强大的组件系统，同时添加专业级功能，如自动搜索表单和增强的数据处理能力。
