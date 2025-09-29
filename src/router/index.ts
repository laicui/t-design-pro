import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/table/example/base'
  }
]

// 扫描所有 */example/*.vue
const modules = import.meta.glob('../components/**/example/*.vue')

const AppLayout = () => import('@/App.vue')

// 暂存父路由映射
const parentMap: Record<string, RouteRecordRaw> = {}
// 自动注册example下的文件路由，比如 /Table/example/base.vue -> /table/example/base
Object.keys(modules).forEach((file) => {
  // ../components/Table/example/base.vue
  // ../components/Form/example/base.vue
  const match = file.match(/..\/components\/(.*?)\/example\/(.*)\.vue$/)
  if (!match) return

  const group = match[1].toLowerCase() // table / form
  const childName = match[2].toLowerCase() // base

  const parentPath = `/${group}/example`

  if (!parentMap[parentPath]) {
    parentMap[parentPath] = {
      path: parentPath,
      component: AppLayout,
      children: []
    }
  }

  parentMap[parentPath].children!.push({
    path: childName,
    component: modules[file]
  })
})

export const router = createRouter({
  history: createWebHistory(),
  routes: [...routes, ...Object.values(parentMap)]
})
