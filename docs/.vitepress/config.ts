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
  appearance: false,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      level: 'deep',
      label: '页面导航'
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '文档', link: '/what-is-t-design-pro/' }
    ],

    sidebar: [
      {
        text: '简介',
        link: '/what-is-t-design-pro'
      },
      {
        text: '快速开始',
        link: '/quickStart'
      },
      {
        text: '组件',
        items: [{ text: 'TablePro', link: '/components/table-pro' }]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/laicui/t-design-pro' }]
  }
})
