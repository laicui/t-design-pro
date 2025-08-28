# T-Design Pro

<p align="center">
  <strong>基于 TDesign Vue Next 的 Vue 3 高阶组件库</strong>
</p>

<p align="center">
  本项目基于腾讯 <a href="https://github.com/Tencent/tdesign-vue-next">TDesign Vue Next</a> 进行开发，提供更丰富的业务组件
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/t-design-pro">
    <img src="https://img.shields.io/npm/v/t-design-pro.svg" alt="npm version">
  </a>
  <a href="https://github.com/laicui/t-design-pro/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/t-design-pro.svg" alt="license">
  </a>
  <a href="https://www.npmjs.com/package/t-design-pro">
    <img src="https://img.shields.io/npm/dm/t-design-pro.svg" alt="downloads">
  </a>
</p>

<p align="center">
  <a href="https://laicui.github.io/t-design-pro/">📖 在线文档</a> |
  <a href="#组件列表">📦 组件列表</a> |
  <a href="#贡献指南">🤝 贡献指南</a>
</p>

## ✨ 特性

- 🎨 **基于 TDesign 设计体系** - 继承腾讯 TDesign 优秀的设计语言
- 🚀 **开箱即用** - 高质量的 Vue 3 组件，开箱即用
- 📦 **丰富的功能** - 提供表格、表单等常用业务组件的增强版本
- 🔧 **高度可配置** - 灵活的配置项，满足各种业务需求
- 💪 **TypeScript 支持** - 使用 TypeScript 开发，提供完整的类型定义
- 📱 **响应式设计** - 支持各种屏幕尺寸，桌面端友好
- 🎯 **按需加载** - 支持 Tree Shaking，按需引入组件

## 📦 安装

```bash
# npm
npm install t-design-pro

# pnpm (推荐)
pnpm add t-design-pro

# yarn
yarn add t-design-pro

# cnpm
cnpm install t-design-pro
```

## 🔧 前置依赖

**⚠️ 重要提醒：使用本组件库前，项目必须安装以下依赖：**

```bash
# 必须安装 Vue 3.5+
npm install vue@^3.5.0

# 必须安装 TDesign Vue Next
npm install tdesign-vue-next@^1.14.0
```

## 📋 组件列表

| 组件名   | 描述                                       | 文档                                                                   |
| -------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| TablePro | 增强版表格组件，集成搜索、分页、排序等功能 | [查看文档](https://laicui.github.io/t-design-pro/components/table-pro) |

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装组件库
pnpm add t-design-pro

# 安装必要的前置依赖
pnpm add vue@^3.5.0 tdesign-vue-next@^1.14.0
```

### 2. 全局注册组件

```typescript
// main.ts
import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import TDesignPro from 't-design-pro'

// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'
import 't-design-pro/dist/styles/index.css'

import App from './App.vue'

const app = createApp(App)

app.use(TDesign)
app.use(TDesignPro)

app.mount('#app')
```

### 3. TypeScript 支持

如果你的项目使用 TypeScript，为了获得更好的类型提示和全局组件支持，推荐配置全局类型声明：

#### 推荐方式：通过 tsconfig.json 配置

在你的 `tsconfig.json` 文件中添加类型文件路径：

```json
{
  "compilerOptions": {
    // ... 其他配置
  },
  "include": ["src/**/*", "node_modules/t-design-pro/dist/types/global.d.ts"]
}
```

#### 或者按需导入（无需额外配置）

如果不想配置全局类型，也可以直接按需导入组件：

```typescript
import { TablePro } from 't-design-pro'
// 这种方式可以直接获得完整的类型支持，无需额外配置
```

> **注意**：全局类型声明会自动引用组件的实际类型定义，无需手动维护。

### 4. 使用组件

完成上述配置后，你就可以在 Vue 模板中直接使用组件，并获得完整的 TypeScript 类型提示：

```vue
<template>
  <div>
    <!-- 现在 TablePro 标签会有完整的类型提示 -->
    <TablePro :columns="columns" :data="data" :pagination="pagination" />
  </div>
</template>

<script setup lang="ts">
// 无需手动导入，全局注册的组件会自动获得类型支持
const columns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' }
]

const data = [
  { name: '张三', age: 25 },
  { name: '李四', age: 30 }
]
</script>
```

详细的使用方法和 API 文档请查看：[📖 在线文档](https://laicui.github.io/t-design-pro/)

## 🛠️ 开发

```bash
# 克隆项目
git clone https://github.com/laicui/t-design-pro.git

# 进入项目目录
cd t-design-pro

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建组件库
pnpm build

# 启动文档服务器
pnpm docs:dev

# 构建文档
pnpm docs:build
```

## 📝 更新日志

详细的更新日志请查看 [CHANGELOG.md](./CHANGELOG.md)

## 🤝 贡献指南

我们欢迎所有的贡献，请阅读 [贡献指南](./CONTRIBUTING.md) 了解如何参与项目开发。

### 贡献者

感谢所有为这个项目做出贡献的开发者！

## 📄 许可证

本项目基于 [MIT](./LICENSE) 许可证开源。

## 🔗 相关链接

- [TDesign Vue Next](https://tdesign.tencent.com/vue-next/overview) - 基础组件库
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集

## 💬 交流与支持

如有问题或建议，欢迎通过以下方式联系我们：

- 📖 [查看文档](https://laicui.github.io/t-design-pro/) - 详细的使用指南和 API 文档
- 🐛 [提交 Issue](https://github.com/laicui/t-design-pro/issues) - 报告问题或提出建议
- 💡 [功能请求](https://github.com/laicui/t-design-pro/discussions) - 讨论新功能

---

<p align="center">
  如果这个项目对你有帮助，请给我们一个 ⭐️ Star 支持一下！
</p>
