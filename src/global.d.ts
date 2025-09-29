// 全局组件类型声明文件
// 用户需要在自己项目的 tsconfig.json 中通过 include 引入此文件
// 例如：{ "include": ["node_modules/t-design-pro/dist/types/global.d.ts"] }

import type CosUpload from './components/CosUpload/index.vue'
import type TablePro from './components/Table/index.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    TablePro: typeof TablePro
    CosUpload: typeof CosUpload
  }
}

export {}
