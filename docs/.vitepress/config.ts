import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitepress'

import pkg from '../../package.json' with { type: 'json' }

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
  cleanUrls: true,
  // appearance: false,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      level: 'deep',
      label: '页面导航'
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '指南', link: '/guide/what-is-t-design-pro/', activeMatch: '/guide/' },
      { text: '组件', link: '/components/table-pro/', activeMatch: '/components/' },
      {
        text: pkg.version,
        items: [
          {
            text: '更新日志',
            link: 'https://github.com/laicui/t-design-pro/blob/main/CHANGELOG.md'
          },
          {
            text: '参与贡献',
            link: 'https://github.com/laicui/t-design-pro/blob/main/CONTRIBUTING.md'
          }
        ]
      }
    ],

    sidebar: {
      '/guide/': {
        base: '/guide/',
        items: [
          {
            text: '简介',
            collapsed: false,
            items: [
              {
                text: '什么是 T-Design Pro',
                link: 'what-is-t-design-pro/'
              },
              {
                text: '快速开始',
                link: 'quickStart/'
              }
            ]
          }
        ]
      },
      '/components/': {
        base: '/components/',
        items: [
          { text: 'TablePro', link: 'table-pro/' },
          { text: 'CosUpload', link: 'cos-upload/' },
          { text: 'SwitchPro', link: 'switch/' }
        ]
      }
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/laicui/t-design-pro' }]
  }
})
