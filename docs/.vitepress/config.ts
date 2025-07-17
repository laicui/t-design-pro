import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitepress'

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/t-design-pro/',
  title: 't-design-pro',
  description: 'A VitePress Site',
  vite: {
    resolve: {
      alias: {
        't-design-pro': r('../../src/index.ts'),
        '@': resolve(__dirname, '../../src')
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '文档', link: '/quickStart/install' }
    ],

    sidebar: [
      {
        text: '快速开始',
        items: [{ text: '安装', link: '/quickStart/install' }]
      },
      {
        text: '基础',
        items: [{ text: 'button 按钮', link: '/base/button/' }]
      },
      {
        text: '数据展示',
        items: [{ text: 'table 表格', link: '/dataDisplay/table/' }]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/laicui/t-design-pro' }]
  }
})
