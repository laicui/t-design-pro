import type COS from 'cos-js-sdk-v5'
import { UploadFile } from 'tdesign-vue-next'
export interface CreateCosInstanceOptions {
  Bucket: string
  Region: string
  getAuthorization: COS.COSOptions['getAuthorization']
}

export interface UploadFileOptions {
  file: UploadFile
  path?: string
  pictureHandleRule?: string
  onProgress?: (progressInfo: COS.ProgressInfo) => void
}

type omitOssOptions = 'Bucket' | 'Body' | 'Region' | 'Key' | 'Headers' | 'onProgress'

export interface ICosUploadProps {
  modelValue?: Array<any>
  theme?: string
  max?: number
  abridgeName?: Array<number>
  path: string // 上传路径，必填，根据业务区分
  poster?: Array<any> // 视频封面，当theme为video时有用
  disabled?: boolean
  // t-upload其他支持的属性
  uploadExpandOptions?: object
  maxFileSize?: { size: number; unit: 'B' | 'KB' | 'MB' | 'GB' }
  ossExtendOptions?: Omit<COS.UploadFileParams, omitOssOptions>
  accept?: string
  pictureHandleRule?: string
  // v-model:loading 默认false 共享当前上传的状态
  loading?: boolean
  // 默认false，不显示遮罩。传true时，遮罩默认挂载到body。 传string时，遮罩将挂载到指定的class
  loadingAttach?: boolean | string
  size?: 'small' | 'default'
  // 视频最大时长 单位秒
  videoMaxduration?: number
  //   cos配置，必传，否则无法初始化
  cosOptions: CreateCosInstanceOptions
}

export interface uploadFileToCosOptions extends CreateCosInstanceOptions {
  // 上传地址，必须
  path: string
  // 签名函数 必须
  getAuthorization: COS.COSOptions['getAuthorization']
  onProgress?: (progressData: COS.ProgressInfo) => void
}
