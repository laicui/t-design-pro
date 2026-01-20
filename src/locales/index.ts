import { useLocalStorage, usePreferredLanguages } from '@vueuse/core'
import type { DropdownOption } from 'tdesign-vue-next'
import { computed, getCurrentInstance, Ref } from 'vue'
import { inject } from 'vue'

// 语言代码标准化函数
function normalizeLocale(locale: string): string {
  return locale.replace('_', '-')
}

// 语言代码反向标准化函数(给请求工具添加给后端的请求头使用)
function denormalizeLocale(locale: string): string {
  return locale.replace('-', '_')
}

// 获取浏览器默认语言环境
const languages = usePreferredLanguages()

// 获取标准化的默认语言
const defaultLocale = normalizeLocale(languages.value[0] || 'zh-CN')

const langModuleMap = new Map<string, unknown>()

// 导入语言文件
const modules = import.meta.glob('./langs/**/*.json', { eager: true })

export const langCodeList: Array<string> = []

// 将导入的语言文件转化为 langModuleMap
Object.entries(modules).forEach(([path, module]) => {
  // 从路径中提取语言代码和文件名，例如 './langs/zh-CN/common.json' -> 'zh-CN', 'common'
  const pathMatch = path.match(/\/langs\/([^/]+)\/([^/]+)\.json$/)
  if (pathMatch && pathMatch[1] && pathMatch[2]) {
    const langCode = pathMatch[1]
    const namespace = pathMatch[2] // 文件名作为命名空间，如 'common'
    // 如果该语言已存在
    if (langModuleMap.has(langCode)) {
      const existingMessages = langModuleMap.get(langCode) as any
      langModuleMap.set(langCode, {
        ...existingMessages,
        [namespace]: (module as any).default
      })
    } else {
      langModuleMap.set(langCode, {
        [namespace]: (module as any).default
      })
    }

    langCodeList.push(langCode)
  }
})

// 导出 Message
export const importMessages = computed(() => {
  const message: any = {}
  langModuleMap.forEach((value: any, key) => {
    message[key] = value // 直接使用 value，因为现在已经是处理后的对象了
  })
  return message
})

export const langList = computed(() => {
  const list: DropdownOption[] = []
  langModuleMap.forEach((value: any, key) => {
    list.push({
      content: value.common.lang,
      value: key
    })
  })

  return list
})

// 切换语言
export function changeLocale(newLocale: string) {
  console.log(langList)
  const isHasLang = langList.value.some((lang) => lang.value === newLocale)
  if (!isHasLang) {
    return
  }
  const local = useLocalStorage(localeConfigKey, newLocale)
  local.value = newLocale
}

export const localeConfigKey = `lai-pro-locale`

export function getCurrentLocale() {
  return denormalizeLocale(
    useLocalStorage(localeConfigKey, 'zh-CN').value || defaultLocale
  )
}

const getCurrentLang = computed(() => {
  const injectLang = getCurrentInstance()
    ? inject<Ref<string>>('lai-locale')
    : null
  if (injectLang?.value) {
    return injectLang.value
  }
  return useLocalStorage(localeConfigKey, 'zh-CN').value
})
/**
 * 使用本地语言
 */
export function useLocalLang() {
  /**
   * 翻译函数
   * @param path 翻译路径，如 'components.lang' 或 'common.submit'
   * @returns 翻译后的文本
   */
  function t(path: string): string {
    return computed(() => {
      const messages = importMessages.value
      const langCode = getCurrentLang.value
      const langMessages = messages[langCode]
      if (!langMessages) {
        console.warn(`Language "${langCode}" not found`)
        return path
      }

      // 解析路径，如 'components.lang' -> ['components', 'lang']
      const keys = path.split('.')
      let result: any = langMessages

      // 逐层访问对象
      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = result[key]
        } else {
          console.warn(
            `Translation key "${path}" not found in language "${langCode}"`
          )
          return path
        }
      }

      return typeof result === 'string' ? result : path
    }).value
  }

  return {
    t,
    changeLocale
  }
}
