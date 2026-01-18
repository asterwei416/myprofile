import type { CollectionConfig } from 'payload'

// 將名稱轉換為 URL 友好的 slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // 空格轉連字號
    .replace(/--+/g, '-') // 多個連字號轉單個
    .trim()
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: '分類',
    plural: '分類',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: '內容管理',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // 自動根據名稱生成 slug
        if (data?.name && !data?.slug) {
          data.slug = generateSlug(data.name)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      label: '分類名稱',
      type: 'text',
      required: true,
      admin: {
        description: '例如：n8n、GEM、React、AI 工具',
      },
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
    },
  ],
}
