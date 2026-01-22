import { ImageLoaderProps } from 'next/image'

export interface CloudinaryLoaderOptions {
  crop?: string
  gravity?: string
  aspectRatio?: string
  fixedQuality?: string
}

export function createCloudinaryLoader(options: CloudinaryLoaderOptions = {}) {
  return function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
    // If it's not a Cloudinary URL, return as is (of handle local images if needed)
    if (!src.includes('res.cloudinary.com')) {
      return src
    }

    // Split the URL to inject transformations
    const parts = src.split('/upload/')
    if (parts.length !== 2) {
      return src
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
