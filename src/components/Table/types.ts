import { EnhancedTableProps, FormProps, PrimaryTableCol, TableRowData } from 'tdesign-vue-next'
import { VNode } from 'vue'

type PickTableTreeProps = 'tree' | 'onExpandedTreeNodesChange' | 'treeExpandAndFoldIcon'

type PickPrimaryTableProps =
  | 'rowKey'
  | 'data'
  | 'cellEmptyContent'
  | 'disableDataPage'
  | 'hover'
  | 'height'
  | 'pagination'
  | 'sort'
  | PickTableTreeProps

export type ProTablePropsOmitKey = Omit<EnhancedTableProps, 'rowKey' | 'tree'>

export interface ProTableProps<T extends TableRowData = TableRowData>
  extends Pick<EnhancedTableProps<T>, PickPrimaryTableProps>,
    Pick<FormProps, 'resetType'> {
  request?: ProTableRequestMethod // 请求数据方法
  extendParams?: ExtendParams // 请求扩展参数
  searchFormProps?: SearchFormProps // 搜索表单透传属性
  columns: ProTableCol[] // 表格列数据
  tableProps?: ProTablePropsOmitKey
}

type customColKey = 'operation' | 'row-select'
export interface ProTableCol<T extends TableRowData = any> extends PrimaryTableCol<T> {
  colKey: keyof T extends string ? keyof T | customColKey : string
  hidden?: boolean
  search?: ProTableColSearchType | boolean
  cellContentEnum?: { [key: string | symbol]: any }
}

export type SearchValueType = 't-input' | 't-select' | 't-date-picker' | 't-date-range-picker' | VNode

export interface ProTableColSearchType {
  fieldProps?: { [key: string]: any }
  key?: string
  label?: string
  labelWidth?: number
  valueType?: SearchValueType
  valueEnum?: { [key: string]: any }
  render?: () => VNode
}

export interface SearchFormProps extends Pick<FormProps, 'resetType'> {
  modelValue?: { [key: string]: any }
  formItems: ProTableCol[]
}

export interface ExtendParams {
  [key: string]: any
}

export type ProTableRequestMethod = (params: {
  [key: string]: any
}) => Promise<{ data: Array<any>; total: number } | null>
