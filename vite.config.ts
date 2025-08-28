import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: 'src',
      include: ['src/components/**/*', 'src/index.ts', 'src/global.d.ts'],
      outDir: 'dist/types',
      copyDtsFiles: true
    })
  ],
  resolve: {
    alias: {
      't-design-pro': r('./src/index.ts'),
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'TDesignPro',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue', 'tdesign-vue-next'],
      output: {
        exports: 'named',
        // https://rollupjs.org/configuration-options/#output-assetfilenames
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names[0]
          if (name.endsWith('.css')) {
            return 'styles/index[extname]'
          }
          return '[name][extname]'
        },
        globals: {
          vue: 'Vue',
          'tdesign-vue-next': 'TDesign'
        }
      }
    }
  }
})
