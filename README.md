# T-Design Pro

基于 TDesign 的 Vue 3 高阶组件库

[查看在线文档](https://www.baidu.com)

## 安装

```bash
npm install t-design-pro

pnpm add t-design-pro

cnpm install t-design-pro

yarn add t-design-pro
```

## 前置依赖

**⚠️ 重要提醒：使用本组件库前，项目必须安装以下依赖：**

```bash
# 必须安装 Vue 3.5+
npm install vue@^3.5.0

# 必须安装 TDesign Vue Next
npm install tdesign-vue-next@^1.14.0
```

## 使用方法

### 完整引入

```javascript
import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import TDesignPro from 't-design-pro'
import 'tdesign-vue-next/es/style/index.css'
import 't-design-pro/dist/styles/index.css'
const app = createApp(App)
app.use(TDesign)
app.use(TDesignPro)
app.mount('#app')
```

### 按需引入

```javascript
import { TablePro, CardPro, FormPro } from 't-design-pro'
```

