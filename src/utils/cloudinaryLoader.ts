import { ImageLoaderProps } from 'next/image'

export interface CloudinaryLoaderOptions {
  crop?: string
  gravity?: string
  aspectRatio?: string
  fixedQuality?: string
}

export function createCloudinaryLoader(options: CloudinaryLoaderOptions = {}) {
  return function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
    let targetSrc = src
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    // 如果網址是本地 API 路徑且有設定 Cloudinary，則嘗試轉換為 Cloudinary 路徑
    if (src.startsWith('/api/media/file/') && cloudName) {
      const fileName = src.split('/').pop()
      targetSrc = `https://res.cloudinary.com/${cloudName}/image/upload/v1/myprofile-media/${fileName}`
    }

    // If it's not a Cloudinary URL, return as is (of handle local images if needed)
    if (!targetSrc.includes('res.cloudinary.com')) {
      return targetSrc
    }

    // Split the URL to inject transformations
    const parts = targetSrc.split('/upload/')
    if (parts.length !== 2) {
      return targetSrc
    }

    // Cloudinary params
    // If fixedQuality is set, use it. Otherwise use the quality passed by Next.js, or default to auto:eco
    const finalQuality = options.fixedQuality || quality || 'auto:eco'

    const params = ['f_auto', `c_${options.crop || 'limit'}`, `w_${width}`, `q_${finalQuality}`]

    if (options.gravity) {
      params.push(`g_${options.gravity}`)
    }

    if (options.aspectRatio) {
      params.push(`ar_${options.aspectRatio}`)
    }

    return `${parts[0]}/upload/${params.join(',')}/${parts[1]}`
  }
}

export default function cloudinaryLoader(props: ImageLoaderProps) {
  return createCloudinaryLoader()(props)
}
