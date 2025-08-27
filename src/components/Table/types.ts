import { EnhancedTableProps, FormProps, PrimaryTableCol, TableRowData } from 'tdesign-vue-next'
import { VNode } from 'vue'

// 表格树相关属性键
type TableTreeKeys = 'tree' | 'onExpandedTreeNodesChange' | 'treeExpandAndFoldIcon'

// 主表格属性键
type PrimaryTableKeys =
  | 'rowKey'
  | 'data'
  | 'cellEmptyContent'
  | 'disableDataPage'
  | 'hover'
  | 'height'
  | 'pagination'
  | 'sort'
  | TableTreeKeys

export type ProTablePropsOmitKey = Omit<EnhancedTableProps, 'rowKey' | 'tree'>

export interface ProTableProps<T extends TableRowData = TableRowData>
  extends Pick<EnhancedTableProps<T>, PrimaryTableKeys>,
    Pick<FormProps, 'resetType'> {
  request?: ProTableRequestMethod<T> // 请求数据方法
  extendParams?: ExtendParams // 请求扩展参数
  searchFormProps?: SearchFormProps // 搜索表单透传属性
  columns: ProTableCol<T>[] // 表格列数据
  tableProps?: ProTablePropsOmitKey
}

type CustomColKey = 'operation' | 'row-select'
export interface ProTableCol<T extends TableRowData = any> extends PrimaryTableCol<T> {
  colKey: keyof T extends string ? keyof T | CustomColKey : string
  hidden?: boolean
  search?: ProTableColSearchType | boolean
  cellContentEnum?: Record<string | number, any>
}

// 组件类型定义
export type SearchComponentType = 't-input' | 't-select' | 't-date-picker' | 't-date-range-picker'
export type SearchRenderType = VNode | (() => VNode)
export type SearchValueType = SearchComponentType | SearchRenderType

export interface ProTableColSearchType {
  fieldProps?: Record<string, any>
  key: string
  label?: string
  labelWidth?: string | number
  valueType?: SearchValueType
  valueEnum?: Record<string, any>
  render?: () => VNode
}

export interface SearchFormProps extends Pick<FormProps, 'resetType'> {
  modelValue?: Record<string, any>
  formItems: ProTableCol[]
}

export type ExtendParams = Record<string, any>

export type ProTableRequestMethod<T extends TableRowData = TableRowData> = (
  params: Record<string, any>
) => Promise<{
  data: T[]
  total: number
} | null>
