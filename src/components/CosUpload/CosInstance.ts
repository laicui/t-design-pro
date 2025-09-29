import COS from 'cos-js-sdk-v5'
import { v4 as uuidv4 } from 'uuid'

import type { CreateCosInstanceOptions, UploadFileOptions } from './types'

export type BucketType = 'private' | 'public'

export default class CosInstance {
  private instance: COS
  // laicui-public-prod-1312851603
  private Bucket: string
  // 'ap-guangzhou'
  private Region: string
  getAuthorization: COS.COSOptions['getAuthorization']

  constructor(options: CreateCosInstanceOptions) {
    if (!options || !options.Bucket || !options.Region || !options.getAuthorization) {
      throw new Error('请传入完整的cosOptions参数')
    }
    this.Bucket = options.Bucket
    this.Region = options.Region
    this.getAuthorization = options.getAuthorization
    this.instance = this.createCosInstance()
  }

  private createCosInstance() {
    return new COS({
      getAuthorization: this.getAuthorization
    })
  }

  async uploadFile(options: UploadFileOptions) {
    try {
      const { file } = options
      const fileName = file.name || ''
      const suffix = fileName.substring(fileName.lastIndexOf('.'))
      const saveName = uuidv4() + suffix
      const Key = options.path + saveName
      // 如果是图片资源，生成压缩参数
      const PicOperations = () => {
        return this.getPicOperations(file.type!, saveName, options.pictureHandleRule || '')
      }
      console.log(this.Bucket)

      const result: any = await this.instance.uploadFile(
        {
          Bucket: this.Bucket /* 填入您自己的存储桶，必须字段 */,
          Region: this.Region /* 存储桶所在地域，例如ap-beijing，必须字段 */,
          Key /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
          Body: file?.raw as File /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */,
          // SliceSize: 1024 * 1024 * 100 /* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */,
          Headers: {
            ...PicOperations()
          },
          // onTaskReady(taskId) {
          //   /* 非必须 */
          //   console.log('taskId', taskId);
          // },
          onProgress(progressInfo) {
            /* 非必须 */
            if (typeof options?.onProgress === 'function') {
              options.onProgress(progressInfo)
            }
          }
          // onFileFinish(err, data, options) {
          //   console.log(options);

          //   /* 非必须 */
          //   console.log(`${options.Key}上传${err ? '失败' : '完成'}`);
          // },
        }
        // (err, data) => {
        //   console.log(err || data);
        // },
      )
      const data: { [key: string]: any } = {
        name: file.name,
        size: file.size,
        type: file.type,
        key: Key,
        md5: result.ETag,
        width: Number(result?.UploadResult?.ProcessResults?.Object?.Width || 0),
        height: Number(result?.UploadResult?.ProcessResults?.Object?.Height || 0)
      }
      if (options.file.type?.startsWith('video/')) {
        const baseData: any = await this.getMediaInfo(Key)
        data.width = Number(baseData?.Response?.MediaInfo?.Stream?.Video?.Width || 0)
        data.height = Number(baseData?.Response?.MediaInfo?.Stream?.Video?.Height || 0)
        data.duration = Number(baseData?.Response?.MediaInfo?.Stream?.Video?.Duration || 0)
      }

      const url = await this.getObjectUrl(Key)
      data.url = url

      return { err: null, data }
    } catch (error) {
      return { err: error, data: null }
    }
  }

  /**
   * 文件格式为图片的时候，返回图片压缩参数
   * @param type string
   * 图片格式，进行压缩
   */
  private getPicOperations(type: string, fileid: string, extendRule: string) {
    if (type.startsWith('image/')) {
      const rules = extendRule ? [extendRule] : ['imageMogr2/format/webp']
      const PicOperations = {
        is_pic_info: 1,
        rules: rules.map((rule) => ({ fileid, rule }))
      }
      return {
        // 通过 imageMogr2 接口使用图片压缩功能
        'Pic-Operations': JSON.stringify(PicOperations)
      }
    }
    return {}
  }

  // 获取图片或视频的基础信息
  private getMediaInfo(key: string) {
    return new Promise((resolve, reject) => {
      this.instance.request(
        {
          Bucket: this.Bucket,
          Region: this.Region,
          Method: 'GET',
          Key: key,
          Query: {
            'ci-process': 'videoinfo' /** 固定值，必须 */
          }
          // Action: type.startsWith('image/') ? 'imageInfo' : undefined,
        },
        (err, data) => {
          if (err) return reject(err)
          resolve(data)
          return data
        }
      )
    })
  }

  // 获取上传文件的临时授权访问地址
  private getObjectUrl(key: string) {
    return new Promise((resolve, reject) => {
      this.instance.getObjectUrl(
        {
          Bucket: this.Bucket /* 填写自己的 bucket，必须字段 */,
          Region: this.Region /* 存储桶所在地域，必须字段 */,
          Key: key /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        },
        (err, data) => {
          if (err) return reject(err)
          resolve(data.Url)
          return data.Url
        }
      )
    })
  }

  // 根据视频文件的COS Key，获取视频指定时间的截图
  getVideoSnapshot(key: string, time: number) {
    return new Promise((resolve, reject) => {
      this.instance.request(
        {
          Bucket: this.Bucket,
          Region: this.Region,
          Method: 'GET',
          Key: key,
          Query: {
            'ci-process': 'snapshot' /** 固定值，必须 */,
            time /** 截图的时间点，单位为秒，必须 */,
            // width: 0, /** 截图的宽，非必须 */
            // height: 0, /** 截图的高，非必须 */
            // format: 'jpg', /** 截图的格式，支持 jpg 和 png，默认 jpg，非必须 */
            // rotate: 'auto', /** 图片旋转方式，默认为'auto'，非必须 */
            mode: 'keyframe' /** 截帧方式，默认为'exactframe'，非必须 */
          },
          RawBody: true,
          // 可选返回文件格式为blob
          DataType: 'blob'
        },
        (err, data) => {
          if (err) return reject(err)
          return resolve(data)
        }
      )
    })
  }

  // 下载cos文件资源
  downloadFile(Key: string, filename?: string) {
    this.instance.getObjectUrl(
      {
        Bucket: this.Bucket,
        Region: this.Region,
        Key,
        Expires: 7200
      },
      (err, data) => {
        if (err) return console.log(err)
        const url = data.Url
        const downloadUrl =
          url +
          (url.indexOf('?') > -1 ? '&' : '?') +
          `response-content-disposition=attachment;${
            filename
              ? (() => {
                  const match = Key.match(/(?<=\.)\w+$/)
                  return match ? `filename=${filename}.${match[0]}` : `filename=${filename}`
                })()
              : ''
          }` // 补充强制下载的参数并重命名下载后的文件
        setTimeout(() => window.open(downloadUrl))
        return data
      }
    )
  }
}
