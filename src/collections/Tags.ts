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
      unique: true,
      admin: {
        readOnly: true,
        description: '系統自動生成',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            // 若 slug 為空，則使用 name
            if (data?.name) {
              return data.name
                .replace(/\s+/g, '-') // 空格轉 dash
                .toLowerCase()
            }
            return value
          },
        ],
      },
    },
  ],
}
