// 全局组件类型声明文件
// 此文件为使用 t-design-pro 的项目提供全局组件类型支持

import type { DefineComponent } from 'vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    TablePro: DefineComponent<any, any, any>
  }
}

export {}
