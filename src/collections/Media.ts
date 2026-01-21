import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: '媒體',
    plural: '媒體庫',
  },
  access: {
    read: () => true,
  },
  admin: {
    group: '系統管理',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    adminThumbnail: ({ doc }) => {
      const url = doc?.url as string
      if (!url || typeof url !== 'string') return null
      if (!url.includes('res.cloudinary.com')) return url

      // 針對 Cloudinary 圖片產生 300px 寬的縮圖
      const parts = url.split('/upload/')
      if (parts.length !== 2) return url

      return `${parts[0]}/upload/f_auto,q_auto:low,w_100,c_limit/${parts[1]}`
    },
  },
}
