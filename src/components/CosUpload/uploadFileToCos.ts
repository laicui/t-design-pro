import COS from 'cos-js-sdk-v5'
import { v4 as uuidv4 } from 'uuid'

import { uploadFileToCosOptions } from './types'

export default async (cosOptions: uploadFileToCosOptions, file: File) => {
  const { Bucket, Region, path, onProgress, getAuthorization } = cosOptions
  const cos = new COS({
    // path style 指正式请求时，Bucket 是在 path 里，这样用相同园区多个 bucket 只需要配置一个园区域名
    // ForcePathStyle: true,
    getAuthorization
    // 是否使用全球加速域名。开启该配置后仅以下接口支持操作：putObject、getObject、headObject、optionsObject、multipartInit、multipartListPart、multipartUpload、multipartAbort、multipartComplete、multipartList、sliceUploadFile、uploadFiles
    // UseAccelerate: true,
  })

  try {
    const suffix = file.name.substring(file.name.lastIndexOf('.'))
    const saveName = uuidv4() + suffix
    const Key = path + saveName
    // 获取图片格式处理参数
    const PicOperations = () => {
      return getPicOperations(file.type, saveName)
    }
    const getFile = () => {
      return file
    }

    const result: any = await cos.uploadFile(
      {
        Bucket /* 填入您自己的存储桶，必须字段 */,
        Region /* 存储桶所在地域，例如ap-beijing，必须字段 */,
        Key /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
        Body: getFile() /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */,
        // SliceSize: 1024 * 1024 * 100 /* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */,
        Headers: {
          ...PicOperations()
        },
        // onTaskReady(taskId) {
        //   /* 非必须 */
        //   console.log('taskId', taskId);
        // },
        onProgress(progressData) {
          /* 非必须 */
          onProgress?.(progressData)
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
    if (file.type.startsWith('video/')) {
      const baseData: any = await getMediaInfo(cos, Key, Bucket, Region)
      data.width = Number(
        baseData?.Response?.MediaInfo?.Stream?.Video?.Width || 0
      )
      data.height = Number(
        baseData?.Response?.MediaInfo?.Stream?.Video?.Height || 0
      )
      data.duration = Number(
        baseData?.Response?.MediaInfo?.Stream?.Video?.Duration || 0
      )
    }

    const url = await getObjectUrl(cos, Key, Bucket, Region)
    data.url = url

    return { err: null, data }
  } catch (error) {
    return { err: error, data: null }
  }
}

// 获取上传文件的临时授权访问地址
const getObjectUrl = (cos, Key, Bucket, Region) => {
  return new Promise((resolve, reject) => {
    cos.getObjectUrl(
      {
        Bucket /* 填写自己的 bucket，必须字段 */,
        Region /* 存储桶所在地域，必须字段 */,
        Key /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
      },
      (err, data) => {
        if (err) return reject(err)
        resolve(data.Url)
        return data.Url
      }
    )
  })
}

// 获取图片或视频的基础信息
const getMediaInfo = (cos, key, Bucket, Region) => {
  return new Promise((resolve, reject) => {
    cos.request(
      {
        Bucket,
        Region,
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

/**
 * 文件格式为图片的时候，返回图片压缩参数
 * @param type string
 * 图片格式，进行压缩
 */
const getPicOperations = (type: string, fileid: string) => {
  if (type.startsWith('image/')) {
    return {
      // 通过 imageMogr2 接口使用图片压缩功能
      'Pic-Operations': `{"is_pic_info": 0, "rules": [{"fileid": "${fileid}", "rule": "imageMogr2/format/webp"}]}`
    }
  }
  return {}
}
