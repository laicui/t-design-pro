import { SwitchValue } from 'tdesign-vue-next'

export interface SwitchProProps {
  modelValue?: SwitchValue
  customValue?: [SwitchValue, SwitchValue]
  request?: () => Promise<boolean>
}
