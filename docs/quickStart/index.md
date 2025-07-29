---
prev:
  text: 'what-is-t-design-pro'
  link: '/what-is-t-design-pro'

next:
  text: 'TablePro'
  link: '/components/table-pro'
---

# 快速开始

## 安装

::: code-group

```sh [pnpm]
pnpm i t-design-pro
```

```sh [npm]
npm i t-design-pro
```

```sh [yarn]
yarn add t-design-pro
```

:::

> [!CAUTION] 注意
> 当前组件库依赖于 [tdesign-vue-next](https://tdesign.tencent.com/vue-next/getting-started) ，请先在项目中安装 tdesign-vue-next。

## 使用

### 基础使用

基础使用会全量注册所有组件，如果您的项目大规模使用组件，请放心使用这种方式。

```typescript
import TDesignPro from 't-design-pro'
import TDesign from 'tdesign-vue-next'
import { createApp } from 'vue'
import App from './App.vue'
import 'tdesign-vue-next/es/style/index.css'
import 't-design-pro/dist/styles/index.css'

const app = createApp(App)
app.use(TDesign)
app.use(TDesignPro)

app.mount('#app')
```
