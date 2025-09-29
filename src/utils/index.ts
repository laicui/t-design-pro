// 项目私有工具包
export const isSizeWithinMax = (
  size: number,
  maxSize: number,
  unit: 'B' | 'KB' | 'MB' | 'GB'
): boolean => {
  const unitToBytes = new Map([
    ['B', 1],
    ['KB', 1024],
    ['MB', 1024 ** 2],
    ['GB', 1024 ** 3]
  ])
  const sizeInBytes = size / (unitToBytes.get(unit) || 1)
  return sizeInBytes > maxSize
}
export const getVideoTime = (file: File) => {
  return new Promise((reslove, reject) => {
    try {
      const video = document.createElement('video')
      console.log(file)
      video.src = URL.createObjectURL(file)
      video.ondurationchange = () => {
        const { duration } = video
        console.log(duration)
        reslove(duration)
      }
    } catch (err) {
      reject(err)
    }
  })
}
