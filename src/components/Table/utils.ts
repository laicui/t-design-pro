import { isProxy, toRaw } from 'vue'

import { ProTableCol } from './types'

export const getInitSearchFormData = (
  searchFormItems: ProTableCol[]
): { [key: string]: any } => {
  const formData: { [key: string]: any } = {}
  searchFormItems.forEach((item) => {
    if (!item.search || typeof item.search !== 'object') return

    const searchKey = item.search.key || item.colKey

    if (item.search.dynamicFields && item.search.dynamicFields.length > 0) {
      const defaultFieldKey =
        item.search.defaultFieldKey || item.search.dynamicFields[0].key
      const defaultValue = item.search.fieldProps?.defaultValue ?? ''
      formData[searchKey] = {
        fieldKey: defaultFieldKey,
        value: defaultValue
      }
    } else if (item.search.fieldProps?.defaultValue !== undefined) {
      const defaultValue = item.search.fieldProps.defaultValue
      formData[searchKey] = isProxy(defaultValue)
        ? toRaw(defaultValue)
        : defaultValue
    } else if (item.search.valueType === 't-date-range-picker') {
      formData[searchKey] = []
    }
  })
  return formData
}
