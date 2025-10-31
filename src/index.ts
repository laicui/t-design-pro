import { App } from 'vue'

import ConfigProviderPro from './components/ConfigProvider/index.vue'
import CosUpload from './components/CosUpload/index.vue'
import SwitchPro from './components/Switch/index.vue'
import TablePro from './components/Table/index.vue'

// 自动遍历 components 文件夹的方法
const importComponents = () => {
  const modules = (import.meta as any).glob('./components/**/index.vue', { eager: true })
  const components: Record<string, any> = {}
  for (const path in modules) {
    const module = modules[path] as any
    const component = module.default

    if (component && component.name) {
      // 使用组件的 name 属性作为注册名称，如果没有则从路径推断
      const componentName = component.name || path.split('/').slice(-2, -1)[0] + 'Pro'
      components[componentName] = component
    }
  }

  return components
}

// 全局注册
const install = (app: App) => {
  const components = importComponents()

  Object.keys(components).forEach((name) => {
    app.component(name, components[name])
  })
}

const TDesignPro = {
  install,
  TablePro,
  CosUpload,
  SwitchPro,
  ConfigProviderPro
}

export { ConfigProviderPro, CosUpload, install, SwitchPro, TablePro }
export * from './components/types/index'
export * from './components/utils/index'
export default TDesignPro
