'use client'

import { ImageLoaderProps } from 'next/image'

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  // If it's not a Cloudinary URL, return as is (or handle local images if needed)
  if (!src.includes('res.cloudinary.com')) {
    return src
  }

  // Split the URL to inject transformations
  const parts = src.split('/upload/')
  if (parts.length !== 2) {
    return src
  }

  // Cloudinary params
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto:eco'}`]

  return `${parts[0]}/upload/${params.join(',')}/${parts[1]}`
}
