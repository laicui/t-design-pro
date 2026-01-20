const Bucket = import.meta.env.VITE_COS_BUCKET
const token = import.meta.env.VITE_TOKEN
import {
  GetAuthorizationCallbackParams,
  GetAuthorizationOptions
} from 'cos-js-sdk-v5'
import localForage from 'localforage'
import { MessagePlugin } from 'tdesign-vue-next'
const getAuthorization = (
  _options: GetAuthorizationOptions,
  /** callback 获取完签名或临时密钥后，回传给 SDK 的方法 */
  callback: (
    /** params 回传给 SDK 的签名或获取临时密钥 */
    params: GetAuthorizationCallbackParams
  ) => void
) => {
  try {
    localForage.getItem(`stsCache-public`).then((stsCache: any) => {
      if (stsCache && Date.now() / 1000 + 30 < stsCache.ExpiredTime) {
        callback(stsCache)
        return
      }
      // 公共
      // const URL = `/api/center/tencent/cloud/cos/public/sign`
      // 私有
      const URL = `/api/center/tencent/cloud/cos/sign?bucket=${Bucket}`
      fetch(URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'request-origin': import.meta.env
            .VITE_SERVICE_CENTER_API_REQUEST_ORIGIN // 公共服务接口，请求需携带来源
        }
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.code !== 'success') {
            MessagePlugin.error('获取COS上传凭证失败')
            callback({} as any)
            return
          }
          const data = {
            TmpSecretId: json.data.credentials.tmpSecretId,
            TmpSecretKey: json.data.credentials.tmpSecretKey,
            SecurityToken: json.data.credentials.sessionToken,
            StartTime: json.data.startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
            ExpiredTime: json.data.expiredTime // 时间戳，单位秒，如：1580000900
          }
          localForage.setItem(`stsCache-public`, data)
          callback(data)
        })
        .catch((err) => {
          console.error(err)
        })
    })
  } catch (error) {
    console.error(error)
  }
}
export default getAuthorization
