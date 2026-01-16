import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: '技術文章',
    plural: '技術文章',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'status'],
    group: '內容管理',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ===== 基本資訊 =====
    {
      name: 'title',
      label: '文章標題',
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
        description: '用於 URL，例如 "react-hooks-guide"',
      },
    },
    {
      name: 'publishedAt',
      label: '發布日期',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy/MM/dd',
        },
      },
    },
    {
      name: 'status',
      label: '發布狀態',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已發布', value: 'published' },
      ],
    },
    {
      name: 'excerpt',
      label: '摘要',
      type: 'textarea',
      admin: {
        description: '文章簡短描述，用於列表頁預覽',
      },
    },
    {
      name: 'coverImage',
      label: '封面圖片',
      type: 'upload',
      relationTo: 'media',
    },
    // ===== 文章內容 =====
    {
      name: 'content',
      label: '文章內容',
      type: 'richText',
      required: true,
    },
    // ===== 標籤（用於雙向關聯） =====
    {
      name: 'tags',
      label: '標籤',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: '選擇相關標籤，系統會自動關聯同標籤的作品',
      },
    },
  ],
}
