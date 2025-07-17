import { isProxy, toRaw } from 'vue'

import { ProTableCol } from './types'

export const getInitSearchFormData = (searchFormItems: ProTableCol[]): { [key: string]: any } => {
  const formData = {}
  searchFormItems.forEach((item) => {
    if (item.search && typeof item.search === 'object' && item.search.fieldProps?.defaultValue) {
      formData[item.search.key || item.colKey] = isProxy(item.search.fieldProps.defaultValue)
        ? toRaw(item.search.fieldProps.defaultValue)
        : item.search.fieldProps.defaultValue
    }
  })
  return formData
}
