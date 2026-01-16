import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    singular: '標籤',
    plural: '標籤',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: '標籤名稱',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: '網址代稱',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: '用於 URL，例如 "react" 或 "ai-tools"',
      },
    },
  ],
}
