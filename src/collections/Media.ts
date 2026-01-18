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
  upload: true,
}
