import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const ComponentNameMap: Record<string, string> = {
  Table: 'TablePro',
  CosUpload: 'CosUpload',
  Switch: 'SwitchPro'
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/index.vue')
  }
]

// 扫描所有 */example/*.vue
const modules = import.meta.glob('../components/**/example/*.vue')

// 暂存父路由映射
const parentMap: Record<string, RouteRecordRaw> = {}
// 自动注册example下的文件路由，比如 /Table/example/base.vue -> /table/example/base
Object.keys(modules).forEach((file) => {
  // ../components/Table/example/base.vue
  // ../components/Form/example/base.vue
  const match = file.match(/..\/components\/(.*?)\/example\/(.*)\.vue$/)
  if (!match) return

  const title = ComponentNameMap[match[1]] || match[1]
  const parentPath = match[1]
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
  const parentName = match[1]
  const path = match[2]
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
  const name = match[2]

  if (!parentMap[parentPath]) {
    parentMap[parentPath] = {
      path: `/${parentPath}`,
      name: parentName,
      meta: { title },
      children: []
    }
  }

  if (parentMap[parentPath].children?.length === 0) {
    parentMap[parentPath].redirect = `${parentPath}/${path}`
  }

  parentMap[parentPath].children!.push({
    path,
    name: `${parentName}${name}`,
    component: modules[file],
    meta: { title: path }
  })
})

export const DynamicRoutes = [...Object.values(parentMap)]

export const router = createRouter({
  history: createWebHistory(),
  routes: [...routes, ...DynamicRoutes]
})
